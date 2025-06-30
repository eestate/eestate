import express from 'express';
import * as contentController from '../controllers/contentController.js';
import { protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/contact', contentController.createContactSubmission); // Public
router.get('/contact', protect, contentController.getContactSubmissions); // Admin
router.patch('/contact/:id', protect, contentController.updateContactSubmission); // Admin
router.delete('/contact/:id', protect, contentController.deleteContactSubmission); // Admin

router.post('/terms', protect, contentController.createTermsAndConditions); // Admin
router.get('/terms', contentController.getTermsAndConditions); // Public
router.patch('/terms/:id', protect, contentController.updateTermsAndConditions); // Admin
router.delete('/terms/:id', protect,  contentController.deleteTermsAndConditions); // Admin

router.post('/faq', protect, contentController.createHelpFAQ); // Admin
router.get('/faq', contentController.getHelpFAQs); // Public 
router.patch('/faq/:id', protect, contentController.updateHelpFAQ); // Admin
router.delete('/faq/:id', protect,  contentController.deleteHelpFAQ); // Admin

router.post('/privacy', protect,  contentController.createPrivacyPolicy); // Admin
router.get('/privacy', contentController.getPrivacyPolicy); // Public
router.patch('/privacy/:id', protect,  contentController.updatePrivacyPolicy); // Admin
router.delete('/privacy/:id', protect,  contentController.deletePrivacyPolicy); // Admin

export default router;