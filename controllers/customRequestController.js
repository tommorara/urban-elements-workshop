// controllers/customRequestController.js

const CustomRequest = require('../models/CustomRequest');
const fs = require('fs');
const path = require('path');

// @desc    Submit a custom design request
// @route   POST /api/custom-requests
// @access  Public
exports.submitCustomRequest = async (req, res) => {
  const { name, email, phone, message, projectDetails } = req.body;

  // Multer stores file info in req.files (array)
  const uploadedImagePaths = req.files ? req.files.map(file =>
    `${req.protocol}://${req.get('host')}/uploads/custom-requests/${file.filename}`
  ) : [];

  try {
    const request = await CustomRequest.create({
      name,
      email,
      phone,
      message,
      projectDetails,
      imageUploads: uploadedImagePaths,
    });

    res.status(201).json({
      message: 'Custom design request submitted successfully!',
      request,
    });
  } catch (error) {
    console.error('Submit custom request error:', error.message);
    // Clean up uploaded files if creation fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting partial upload:', err);
        });
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get custom requests made by the logged-in user
// @route   GET /api/custom-requests/user
// @access  Private
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await CustomRequest.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching user requests:', err.message);
    res.status(500).json({ message: 'Failed to get your custom requests' });
  }
};

// @desc    Get a single custom request by ID
// @route   GET /api/custom-requests/:id
// @access  Private (Admin)
exports.getCustomRequestById = async (req, res) => {
  try {
    const request = await CustomRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Custom request not found' });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error('Get custom request by ID error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Custom request not found' });
    }
    res.status(500).json({ message: 'Server error retrieving custom request' });
  }
};

// @desc    Update status of a custom request
// @route   PUT /api/custom-requests/:id/status
// @access  Private (Admin)
exports.updateCustomRequestStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required for update' });
  }

  try {
    const request = await CustomRequest.findByIdAndUpdate(
      req.params.id,
      { status: status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!request) {
      return res.status(404).json({ message: 'Custom request not found' });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error('Update custom request status error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a custom request
// @route   DELETE /api/custom-requests/:id
// @access  Private (Admin)
exports.deleteCustomRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const request = await CustomRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Custom request not found' });
    }

    // Optional: Delete associated image files from the server
    if (request.imageUploads && request.imageUploads.length > 0) {
      request.imageUploads.forEach(imageUrl => {
        const imageFileName = path.basename(imageUrl);
        // Determine if it's a product image or custom request image based on URL structure
        let dir = '';
        if (imageUrl.includes('/uploads/products/')) {
            dir = 'products';
        } else if (imageUrl.includes('/uploads/custom-requests/')) {
            dir = 'custom-requests';
        }

        if (dir) {
            const imagePath = path.join(__dirname, `../uploads/${dir}`, imageFileName);
            fs.access(imagePath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.warn(`Image file not found for deletion: ${imagePath}`);
                } else {
                    fs.unlink(imagePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error deleting custom request image:', unlinkErr);
                        }
                    });
                }
            });
        }
      });
    }

    await request.remove(); // Or CustomRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: 'Custom request deleted successfully' });
  } catch (error) {
    console.error('Delete custom request error:', error.message);
    res.status(500).json({ message: 'Server error deleting custom request' });
  }
};
