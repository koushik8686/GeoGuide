import pandas as pd
import random
from sklearn.metrics.pairwise import cosine_similarity

# Sample visited logs (each entry represents a visit)
visited_log = [
    {"user": "A", "tag": "beach"},
    {"user": "A", "tag": "mountain"},
    {"user": "A", "tag": "beach"},
    {"user": "B", "tag": "desert"},
    {"user": "B", "tag": "beach"},
    {"user": "C", "tag": "forest"},
    {"user": "C", "tag": "mountain"},
    {"user": "C", "tag": "mountain"},
    {"user": "D", "tag": "desert"},
    {"user": "D", "tag": "forest"},
    {"user": "E", "tag": "beach"},
    {"user": "F", "tag": "lake"},
    {"user": "F", "tag": "canyon"},
    {"user": "A", "tag": "beach"},
    {"user": "B", "tag": "beach"},
    {"user": "C", "tag": "forest"},
    {"user": "D", "tag": "desert"},
    {"user": "E", "tag": "beach"},
    {"user": "E", "tag": "beach"},
    {"user": "F", "tag": "canyon"}
]

# Define all possible tags (even those not in history)
all_possible_tags = {"beach", "mountain", "desert", "forest", "lake", "canyon", "waterfall", "city", "village"}

# Convert list of objects into a DataFrame
df = pd.DataFrame(visited_log)

# Get the set of tags that actually appear in history
tags_in_history = set(df["tag"].unique())

# Create a user-tag matrix (count occurrences)
user_tag_matrix = df.pivot_table(index='user', columns='tag', aggfunc='size', fill_value=0)

# Compute similarity between users
user_similarity = pd.DataFrame(cosine_similarity(user_tag_matrix), 
                               index=user_tag_matrix.index, 
                               columns=user_tag_matrix.index)

def recommend_tags_for_user(user, top_n=3):
    """
    Recommend tags based on similar users' visit history, ensuring all possible tags are considered.
    
    Parameters:
        user (str): The user for whom recommendations are needed.
        top_n (int): Number of recommended tags.
        
    Returns:
        List of recommended tags.
    """
    if user not in user_similarity:
        # If the user is new, suggest a mix of popular tags and unvisited ones
        popular_tags = list(df["tag"].value_counts().index[:top_n])
        unvisited_tags = list(all_possible_tags - tags_in_history)
        random.shuffle(unvisited_tags)
        return (popular_tags + unvisited_tags)[:top_n]

    # Find the most similar users
    similar_users = user_similarity[user].drop(user).sort_values(ascending=False)

    # Get tags visited by the user
    user_tags = set(df[df['user'] == user]['tag'])

    # Ensure all available tags are considered
    recommendations = {tag: 0 for tag in all_possible_tags}

    # Update scores based on similar users' preferences
    for similar_user in similar_users.index:
        similar_user_tags = set(df[df['user'] == similar_user]['tag'])

        for tag in all_possible_tags:
            if tag not in user_tags:  # Only suggest new tags
                recommendations[tag] += user_similarity[user][similar_user] * (tag in similar_user_tags)

    # Sort recommended tags by relevance
    sorted_recommendations = sorted(recommendations, key=recommendations.get, reverse=True)
    
    return sorted_recommendations[:top_n]

# Example Usage
user_id = "A"  # Existing user
suggestions = recommend_tags_for_user(user_id)
print(f"Based on user '{user_id}', suggested future destinations: {suggestions}")

# New user case
new_user_id = "Z"
new_user_suggestions = recommend_tags_for_user(new_user_id)
print(f"New user '{new_user_id}' suggested destinations: {new_user_suggestions}")
 