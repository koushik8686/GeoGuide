import numpy as np
import pandas as pd
from collections import defaultdict
import pickle
import random
import time
import os
import threading
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('tag_recommender')

class TagRecommendationModel:
    def __init__(self, all_possible_tags):
        """
        Initialize a recommendation model that can be updated incrementally.
        
        Parameters:
            all_possible_tags (set): Set of all possible tags that can be recommended
        """
        self.all_possible_tags = all_possible_tags
        self.tag_list = sorted(list(all_possible_tags))
        self.tag_to_idx = {tag: idx for idx, tag in enumerate(self.tag_list)}
        
        # Tag co-occurrence matrix
        self.cooccurrence_matrix = np.zeros((len(self.tag_list), len(self.tag_list)))
        
        # Tag popularity counts
        self.tag_counts = {tag: 0 for tag in self.tag_list}
        
        # Total visits processed
        self.total_visits = 0
        
        # Cache for quick lookup
        self.similarity_cache = {}
        
        # Track when the model was last updated
        self.last_updated = datetime.now()
        
        # Version tracking
        self.version = 1
        
    def fit(self, visited_log):
        """
        Train the model on historical visit data
        
        Parameters:
            visited_log (list): List of dictionaries containing user and tag information
        """
        start_time = time.time()
        logger.info("Starting model training with %d visit records", len(visited_log))
        
        # Reset data
        self.cooccurrence_matrix = np.zeros((len(self.tag_list), len(self.tag_list)))
        self.tag_counts = {tag: 0 for tag in self.tag_list}
        self.total_visits = 0
        self.similarity_cache = {}
        
        # Group by user
        user_visits = defaultdict(list)
        for visit in visited_log:
            user_visits[visit["user"]].append(visit["tag"])
        
        # Calculate co-occurrence matrix
        for user, tags in user_visits.items():
            for i, tag1 in enumerate(tags):
                if tag1 not in self.tag_to_idx:
                    logger.warning(f"Tag '{tag1}' not in known tags, skipping")
                    continue
                    
                idx1 = self.tag_to_idx[tag1]
                self.tag_counts[tag1] += 1
                
                # Co-occurrence with other tags
                for tag2 in tags:
                    if tag2 not in self.tag_to_idx:
                        continue
                    idx2 = self.tag_to_idx[tag2]
                    self.cooccurrence_matrix[idx1, idx2] += 1
        
        self.total_visits = sum(self.tag_counts.values())
        
        # Normalize the co-occurrence matrix
        for i in range(len(self.tag_list)):
            if self.tag_counts[self.tag_list[i]] > 0:
                self.cooccurrence_matrix[i, :] /= self.tag_counts[self.tag_list[i]]
        
        self.last_updated = datetime.now()
        self.version += 1
        
        training_time = time.time() - start_time
        logger.info(f"Model training completed in {training_time:.4f} seconds. Version: {self.version}")
        
        return self
    
    def update(self, new_history, batch_update=True):
        """
        Update the model with new visit data
        
        Parameters:
            new_history (list): List of dictionaries with user and tag information
            batch_update (bool): Whether to batch multiple updates
        """
        if not new_history:
            logger.info("No new history to update with")
            return self
            
        start_time = time.time()
        logger.info(f"Updating model with {len(new_history)} new records")
        
        # Group by user
        user_visits = defaultdict(list)
        for visit in new_history:
            tag = visit["tag"]
            if tag not in self.tag_to_idx:
                logger.warning(f"Tag '{tag}' not in known tags, skipping")
                continue
            user_visits[visit["user"]].append(tag)
        
        # Update co-occurrence matrix and tag counts
        affected_tags = set()
        for user, tags in user_visits.items():
            for tag1 in tags:
                idx1 = self.tag_to_idx[tag1]
                self.tag_counts[tag1] += 1
                affected_tags.add(tag1)
                
                # Co-occurrence with other tags
                for tag2 in tags:
                    idx2 = self.tag_to_idx[tag2]
                    self.cooccurrence_matrix[idx1, idx2] += 1
        
        self.total_visits += sum(len(tags) for tags in user_visits.values())
        
        # Re-normalize affected rows in the co-occurrence matrix
        for tag in affected_tags:
            idx = self.tag_to_idx[tag]
            if self.tag_counts[tag] > 0:
                self.cooccurrence_matrix[idx, :] = self.cooccurrence_matrix[idx, :] / self.tag_counts[tag]
        
        # Clear affected cache entries
        for tag in affected_tags:
            if tag in self.similarity_cache:
                del self.similarity_cache[tag]
        
        self.last_updated = datetime.now()
        self.version += 1
        
        update_time = time.time() - start_time
        logger.info(f"Model update completed in {update_time:.4f} seconds. Version: {self.version}")
        
        return self
    
    def recommend(self, user_history, top_n=3):
        """
        Recommend tags based on user's history
        
        Parameters:
            user_history (list): List of dictionaries with 'tag' and 'count' for a single user
            top_n (int): Number of tags to recommend
            
        Returns:
            List of recommended tags
        """
        start_time = time.time()
        
        # Handle empty history case
        if not user_history:
            # Return popular tags
            popular_tags = sorted(self.tag_counts.items(), key=lambda x: x[1], reverse=True)
            result = [tag for tag, _ in popular_tags[:top_n]]
            logger.info(f"Generated {len(result)} recommendations for new user in {time.time() - start_time:.4f}s")
            return result
        
        # Convert user history to vector
        user_tags = {}
        for item in user_history:
            tag = item['tag']
            if tag in self.tag_to_idx:
                user_tags[tag] = item['count']
            else:
                logger.warning(f"Tag '{tag}' in user history not found in model")
        
        # Get tags already visited by the user
        visited_tags = set(user_tags.keys())
        
        # Skip if no valid tags in history
        if not user_tags:
            popular_tags = sorted(self.tag_counts.items(), key=lambda x: x[1], reverse=True)
            result = [tag for tag, _ in popular_tags[:top_n]]
            logger.info(f"Generated {len(result)} popularity-based recommendations in {time.time() - start_time:.4f}s")
            return result
        
        # Calculate weighted similarity scores for each tag
        scores = {}
        
        # Calculate recommendation scores using vectorized operations
        user_vector = np.zeros(len(self.tag_list))
        for tag, count in user_tags.items():
            user_vector[self.tag_to_idx[tag]] = count
        
        # Normalize user vector
        total_count = sum(user_tags.values())
        user_vector = user_vector / total_count if total_count > 0 else user_vector
        
        # Get similarity scores for all tags at once
        tag_scores = np.matmul(user_vector, self.cooccurrence_matrix)
        
        # Apply popularity bias and filter out visited tags
        for tag in self.tag_list:
            if tag not in visited_tags:
                idx = self.tag_to_idx[tag]
                score = tag_scores[idx]
                
                # Apply popularity bias (logarithmic to avoid domination)
                popularity_factor = np.log1p(self.tag_counts[tag]) if self.tag_counts[tag] > 0 else 0
                score = score * 0.8 + popularity_factor * 0.2
                
                scores[tag] = score
        
        # Sort and return top recommendations
        recommendations = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        # Add random recommendations if not enough scored ones
        if len(recommendations) < top_n:
            remaining_tags = list(self.all_possible_tags - visited_tags - set([tag for tag, _ in recommendations]))
            random.shuffle(remaining_tags)
            recommendations.extend([(tag, 0) for tag in remaining_tags])
        
        result = [tag for tag, _ in recommendations[:top_n]]
        logger.info(f"Generated {len(result)} recommendations in {time.time() - start_time:.4f}s")
        return result
    
    def save(self, filepath):
        """Save the model to a file"""
        start_time = time.time()
        with open(filepath, 'wb') as f:
            pickle.dump(self, f)
        logger.info(f"Model saved to {filepath} in {time.time() - start_time:.4f}s")
    
    @classmethod
    def load(cls, filepath):
        """Load the model from a file"""
        start_time = time.time()
        with open(filepath, 'rb') as f:
            model = pickle.load(f)
        logger.info(f"Model loaded from {filepath} in {time.time() - start_time:.4f}s")
        return model
    
    def get_info(self):
        """Return model information"""
        return {
            "version": self.version,
            "tags_count": len(self.tag_list),
            "total_visits": self.total_visits,
            "last_updated": self.last_updated.isoformat(),
            "most_popular_tags": sorted(self.tag_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        }


class TagRecommenderService:
    """Service layer for tag recommendations"""
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls, *args, **kwargs):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(TagRecommenderService, cls).__new__(cls)
                cls._instance._initialized = False
            return cls._instance
    
    def __init__(self, model_path="tag_recommendation_model.pkl", all_possible_tags=None):
        # Only initialize once
        if self._initialized:
            return
            
        self._model_path = model_path
        self._model = None
        self._all_possible_tags = all_possible_tags
        self._update_queue = []
        self._batch_update_size = 50
        self._batch_update_thread = None
        self._should_stop = False
        self._lock = threading.Lock()
        
        # Try to load the model
        self._load_or_create_model()
        
        # Start background updater
        self._start_batch_updater()
        
        self._initialized = True
    
    def _load_or_create_model(self):
        """Load an existing model or create a new one"""
        if os.path.exists(self._model_path):
            try:
                self._model = TagRecommendationModel.load(self._model_path)
                logger.info("Model loaded successfully")
                return
            except Exception as e:
                logger.error(f"Failed to load model: {str(e)}")
        
        # Create new model if loading failed or file doesn't exist
        if self._all_possible_tags:
            logger.info("Creating new model")
            self._model = TagRecommendationModel(self._all_possible_tags)
        else:
            raise ValueError("Cannot create new model: all_possible_tags not provided")
    
    def _start_batch_updater(self):
        """Start the background thread for batch updates"""
        self._batch_update_thread = threading.Thread(target=self._batch_update_worker)
        self._batch_update_thread.daemon = True
        self._batch_update_thread.start()
    
    def _batch_update_worker(self):
        """Background worker to process batch updates"""
        while not self._should_stop:
            if len(self._update_queue) >= self._batch_update_size:
                with self._lock:
                    batch = self._update_queue[:self._batch_update_size]
                    self._update_queue = self._update_queue[self._batch_update_size:]
                
                # Update the model with the batch
                try:
                    self._model.update(batch)
                    # Save the model after batch update
                    self._model.save(self._model_path)
                except Exception as e:
                    logger.error(f"Error in batch update: {str(e)}")
            
            # Sleep before next check
            time.sleep(1)
    
    def stop(self):
        """Stop the service and save model"""
        self._should_stop = True
        if self._batch_update_thread:
            self._batch_update_thread.join(timeout=5)
        
        # Process any remaining updates
        with self._lock:
            if self._update_queue:
                try:
                    self._model.update(self._update_queue)
                    self._model.save(self._model_path)
                    self._update_queue = []
                except Exception as e:
                    logger.error(f"Error in final update: {str(e)}")
    
    def get_recommendations(self, user_history, top_n=3):
        """Get recommendations for a user"""
        if not self._model:
            raise RuntimeError("Model not initialized")
        
        return self._model.recommend(user_history, top_n)
    
    def add_visit(self, user_id, tag, count=1):
        """Add a new visit to the update queue"""
        visit = {"user": user_id, "tag": tag}
        with self._lock:
            self._update_queue.append(visit)
        
        # Immediate update if queue is getting large
        if len(self._update_queue) >= self._batch_update_size * 2:
            self.force_update()
    
    def add_user_history(self, user_id, tags_with_counts):
        """Add multiple tags from user history"""
        visits = []
        for item in tags_with_counts:
            tag = item['tag']
            count = item.get('count', 1)
            for _ in range(count):
                visits.append({"user": user_id, "tag": tag})
        
        with self._lock:
            self._update_queue.extend(visits)
    
    def force_update(self):
        """Force an immediate update with all queued data"""
        with self._lock:
            if not self._update_queue:
                return
            
            batch = self._update_queue
            self._update_queue = []
        
        try:
            self._model.update(batch)
            self._model.save(self._model_path)
        except Exception as e:
            logger.error(f"Error in forced update: {str(e)}")
    
    def get_model_info(self):
        """Get information about the current model"""
        if not self._model:
            return {"status": "not_initialized"}
        
        info = self._model.get_info()
        info["pending_updates"] = len(self._update_queue)
        return info
    
    def train_model(self, visited_log):
        """Train/retrain the model with full visit history"""
        if not self._model:
            raise RuntimeError("Model not initialized")
        
        # Clear update queue first
        with self._lock:
            self._update_queue = []
        
        # Train the model
        self._model.fit(visited_log)
        self._model.save(self._model_path)
        
        return self._model.get_info()


# Example API functions using the service
def initialize_recommendation_service(all_tags):
    """Initialize the recommender service with all possible tags"""
    global recommender_service
    recommender_service = TagRecommenderService(all_possible_tags=all_tags)
    return recommender_service.get_model_info()

def get_tag_recommendations(user_history, top_n=3):
    """Get tag recommendations for a user"""
    global recommender_service
    if 'recommender_service' not in globals():
        raise RuntimeError("Recommendation service not initialized")
    
    return recommender_service.get_recommendations(user_history, top_n)

def record_user_visit(user_id, tag):
    """Record a single user visit"""
    global recommender_service
    if 'recommender_service' not in globals():
        raise RuntimeError("Recommendation service not initialized")
    
    recommender_service.add_visit(user_id, tag)
    return {"status": "success", "queued": True}

def update_from_user_history(user_id, history):
    """Update model from user history"""
    global recommender_service
    if 'recommender_service' not in globals():
        raise RuntimeError("Recommendation service not initialized")
    
    recommender_service.add_user_history(user_id, history)
    return {"status": "success", "queued": True}

def force_model_update():
    """Force the model to update immediately"""
    global recommender_service
    if 'recommender_service' not in globals():
        raise RuntimeError("Recommendation service not initialized")
    
    recommender_service.force_update()
    return recommender_service.get_model_info()

def train_recommendation_model(visit_data):
    """Fully train/retrain the model"""
    global recommender_service
    if 'recommender_service' not in globals():
        raise RuntimeError("Recommendation service not initialized")
    
    return recommender_service.train_model(visit_data)

def shutdown_recommendation_service():
    """Shutdown the recommendation service gracefully"""
    global recommender_service
    if 'recommender_service' not in globals():
        return {"status": "not_running"}
    
    recommender_service.stop()
    return {"status": "stopped"}


# Example usage
if __name__ == "__main__":
    # Define all possible tags
    all_possible_tags = {"beach", "mountain", "desert", "forest", "lake", "canyon", "waterfall", "city", "village"}
    
    # Initialize service
    service_info = initialize_recommendation_service(all_possible_tags)
    print(f"Service initialized: {service_info}")
    
    # Sample data for initial training
    visited_log = [
        {"user": "A", "tag": "beach"},
        {"user": "A", "tag": "mountain"},
        {"user": "B", "tag": "desert"},
        {"user": "C", "tag": "forest"}
    ]
    
    # Train the model
    training_result = train_recommendation_model(visited_log)
    print(f"Training complete: {training_result}")
    
    # Get recommendations for a user
    user_history = [
        {"tag": "beach", "count": 2},
        {"tag": "mountain", "count": 1}
    ]
    
    recommendations = get_tag_recommendations(user_history, top_n=3)
    print(f"Recommendations: {recommendations}")
    
    # Record new visits
    record_user_visit("A", "canyon")
    record_user_visit("B", "beach")
    
    # Force update
    update_info = force_model_update()
    print(f"Forced update: {update_info}")
    
    # Get updated recommendations
    new_recommendations = get_tag_recommendations(user_history, top_n=3)
    print(f"New recommendations: {new_recommendations}")
    
    # Clean shutdown
    shutdown_info = shutdown_recommendation_service()
    print(f"Service shutdown: {shutdown_info}")