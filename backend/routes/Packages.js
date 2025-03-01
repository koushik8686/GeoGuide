import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Package from '../models/Package.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find()
      .populate('bookings.user', 'name email')
      .populate('reviews.user', 'name email')
      .sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific package
router.get('/:id', async (req, res) => {
  try {
    const package_ = await Package.findById(req.params.id)
      .populate('bookings.user', 'name email')
      .populate('reviews.user', 'name email');
    if (!package_) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(package_);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new package (protected route)
router.post('/', protect, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'agencyLogo', maxCount: 1 }
]), async (req, res) => {
  try {
    const packageData = JSON.parse(req.body.data);
    
    // Upload images to Cloudinary
    const imageUpload = req.files['image'] ? 
      await cloudinary.uploader.upload(
        `data:${req.files['image'][0].mimetype};base64,${req.files['image'][0].buffer.toString('base64')}`
      ) : null;
    
    const logoUpload = req.files['agencyLogo'] ? 
      await cloudinary.uploader.upload(
        `data:${req.files['agencyLogo'][0].mimetype};base64,${req.files['agencyLogo'][0].buffer.toString('base64')}`
      ) : null;

    // Create new package with uploaded image URLs
    const newPackage = new Package({
      ...packageData,
      image: imageUpload?.secure_url,
      agencyLogo: logoUpload?.secure_url,
      availableSpots: packageData.maxCapacity
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add a review to a package (protected route)
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const package_ = await Package.findById(req.params.id);

    if (!package_) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Check if user has already reviewed
    const hasReviewed = package_.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (hasReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this package' });
    }

    // Add the review
    package_.reviews.push({
      user: req.user._id,
      rating,
      comment
    });

    await package_.save();
    res.status(201).json(package_);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Book a package (protected route)
router.post('/:id/book', protect, async (req, res) => {
  try {
    const { selectedDate, numberOfPeople } = req.body;
    const package_ = await Package.findById(req.params.id);

    if (!package_) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Find the selected date in package dates
    const dateInfo = package_.dates.find(d => d.date === selectedDate);
    if (!dateInfo) {
      return res.status(400).json({ message: 'Invalid date selected' });
    }

    // Check availability
    if (dateInfo.availableSpots < numberOfPeople) {
      return res.status(400).json({ message: 'Not enough spots available' });
    }

    // Calculate total price
    const totalPrice = dateInfo.price * numberOfPeople;

    // Create booking
    package_.bookings.push({
      user: req.user._id,
      selectedDate,
      numberOfPeople,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Update available spots
    dateInfo.availableSpots -= numberOfPeople;

    await package_.save();
    res.status(201).json(package_);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update booking status (protected route)
router.put('/:id/bookings/:bookingId', protect, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const package_ = await Package.findById(req.params.id);

    if (!package_) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const booking = package_.bookings.id(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await package_.save();
    res.json(package_);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a package (protected route)
router.put('/:id', protect, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'agencyLogo', maxCount: 1 }
]), async (req, res) => {
  try {
    const packageData = JSON.parse(req.body.data);
    const package_ = await Package.findById(req.params.id);

    if (!package_) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Upload new images if provided
    if (req.files['image']) {
      const imageUpload = await cloudinary.uploader.upload(
        `data:${req.files['image'][0].mimetype};base64,${req.files['image'][0].buffer.toString('base64')}`
      );
      packageData.image = imageUpload.secure_url;
    }

    if (req.files['agencyLogo']) {
      const logoUpload = await cloudinary.uploader.upload(
        `data:${req.files['agencyLogo'][0].mimetype};base64,${req.files['agencyLogo'][0].buffer.toString('base64')}`
      );
      packageData.agencyLogo = logoUpload.secure_url;
    }

    // Update package
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      { ...packageData },
      { new: true }
    ).populate('bookings.user', 'name email')
     .populate('reviews.user', 'name email');

    res.json(updatedPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a package (protected route)
router.delete('/:id', protect, async (req, res) => {
  try {
    const package_ = await Package.findById(req.params.id);
    
    if (!package_) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Check if there are any active bookings
    const activeBookings = package_.bookings.filter(
      booking => booking.status === 'confirmed' && booking.paymentStatus === 'completed'
    );

    if (activeBookings.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete package with active bookings' 
      });
    }

    // Delete images from Cloudinary if they exist
    if (package_.image) {
      const publicId = package_.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    if (package_.agencyLogo) {
      const publicId = package_.agencyLogo.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await package_.remove();
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;