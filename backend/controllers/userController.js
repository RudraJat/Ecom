import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price image');
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        addresses: user.addresses,
        wishlist: user.wishlist,
        savedCards: user.savedCards,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = (req.body.name || user.name).trim();
      user.email = (req.body.email || user.email).trim().toLowerCase();
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

      // Handle duplicate email with a clean 400 response instead of generic 500
      if (user.email !== req.user.email) {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('updateUserProfile error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const {
      label,
      fullName,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const normalizedAddress = {
      label: (label || 'Home').toString().trim() || 'Home',
      fullName: (fullName || '').toString().trim(),
      phone: (phone || '').toString().trim(),
      address: (address || '').toString().trim(),
      city: (city || '').toString().trim(),
      state: (state || '').toString().trim(),
      postalCode: (postalCode || '').toString().trim(),
      country: (country || '').toString().trim(),
      isDefault: Boolean(isDefault),
    };

    // Validate required fields manually
    if (
      !normalizedAddress.fullName ||
      !normalizedAddress.phone ||
      !normalizedAddress.address ||
      !normalizedAddress.city ||
      !normalizedAddress.state ||
      !normalizedAddress.postalCode ||
      !normalizedAddress.country
    ) {
      return res.status(400).json({ message: 'Please fill in all required address fields.' });
    }

    const shouldBeDefault = normalizedAddress.isDefault || user.addresses.length === 0;

    // Unset existing defaults if this will become default
    if (shouldBeDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }

    user.addresses.push({
      label: normalizedAddress.label,
      fullName: normalizedAddress.fullName,
      phone: normalizedAddress.phone,
      address: normalizedAddress.address,
      city: normalizedAddress.city,
      state: normalizedAddress.state,
      postalCode: normalizedAddress.postalCode,
      country: normalizedAddress.country,
      isDefault: shouldBeDefault,
    });

    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    console.error('addAddress error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Server error' });
  }
};


// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    if (req.body.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    const nextData = {
      ...req.body,
      label: req.body.label !== undefined ? String(req.body.label).trim() : address.label,
      fullName: req.body.fullName !== undefined ? String(req.body.fullName).trim() : address.fullName,
      phone: req.body.phone !== undefined ? String(req.body.phone).trim() : address.phone,
      address: req.body.address !== undefined ? String(req.body.address).trim() : address.address,
      city: req.body.city !== undefined ? String(req.body.city).trim() : address.city,
      state: req.body.state !== undefined ? String(req.body.state).trim() : address.state,
      postalCode: req.body.postalCode !== undefined ? String(req.body.postalCode).trim() : address.postalCode,
      country: req.body.country !== undefined ? String(req.body.country).trim() : address.country,
    };

    if (
      !nextData.fullName ||
      !nextData.phone ||
      !nextData.address ||
      !nextData.city ||
      !nextData.state ||
      !nextData.postalCode ||
      !nextData.country
    ) {
      return res.status(400).json({ message: 'Please fill in all required address fields.' });
    }

    Object.assign(address, nextData);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    console.error('updateAddress error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses.filter(
      (a) => a._id.toString() !== req.params.addressId
    );
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle wishlist product
// @route   PUT /api/users/wishlist/:productId
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const productId = req.params.productId;
    const isInWishlist = user.wishlist.some((id) => id.toString() === productId);

    if (isInWishlist) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    const updated = await User.findById(req.user._id).populate('wishlist', 'name price image');
    res.json(updated.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add saved card
// @route   POST /api/users/cards
// @access  Private
const addCard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { last4, brand, expiry, isDefault } = req.body;

    if (isDefault || user.savedCards.length === 0) {
      user.savedCards.forEach((c) => (c.isDefault = false));
    }

    user.savedCards.push({ last4, brand, expiry, isDefault: isDefault || user.savedCards.length === 0 });
    await user.save();
    res.status(201).json(user.savedCards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove saved card
// @route   DELETE /api/users/cards/:cardId
// @access  Private
const removeCard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.savedCards = user.savedCards.filter(
      (c) => c._id.toString() !== req.params.cardId
    );
    // If we removed the default and cards remain, set first as default
    if (user.savedCards.length > 0 && !user.savedCards.some((c) => c.isDefault)) {
      user.savedCards[0].isDefault = true;
    }
    await user.save();
    res.json(user.savedCards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Set default card
// @route   PUT /api/users/cards/:cardId/default
// @access  Private
const setDefaultCard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.savedCards.forEach((c) => {
      c.isDefault = c._id.toString() === req.params.cardId;
    });
    await user.save();
    res.json(user.savedCards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  toggleWishlist,
  addCard,
  removeCard,
  setDefaultCard,
};
