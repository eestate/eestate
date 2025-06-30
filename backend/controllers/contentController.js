
import createError from 'http-errors';
import ContactSubmission from '../models/ContactSubmission.js';
import TermsAndConditions from '../models/TermsAndConditions.js';
import HelpFAQ from '../models/HelpFAQ.js';
import PrivacyPolicy from '../models/PrivacyPolicy.js';

const logError = (error, context) => {
  console.error(`Error in ${context}:`, {
    message: error.message,
    stack: error.stack,
  });
};

export const createContactSubmission = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      throw createError(400, 'Name, email, and message are required');
    }
    const submission = new ContactSubmission({ name, email, message });
    await submission.save();
    res.status(201).json({ message: 'Contact submission created successfully', submission });
  } catch (error) {
    logError(error, 'createContactSubmission');
    next(error);
  }
};

export const getContactSubmissions = async (req, res, next) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    logError(error, 'getContactSubmissions');
    next(error);
  }
};

export const updateContactSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { responded } = req.body;
    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { responded, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!submission) {
      throw createError(404, 'Contact submission not found');
    }
    res.status(200).json({ message: 'Contact submission updated successfully', submission });
  } catch (error) {
    logError(error, 'updateContactSubmission');
    next(error);
  }
};

export const deleteContactSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submission = await ContactSubmission.findByIdAndDelete(id);
    if (!submission) {
      throw createError(404, 'Contact submission not found');
    }
    res.status(200).json({ message: 'Contact submission deleted successfully' });
  } catch (error) {
    logError(error, 'deleteContactSubmission');
    next(error);
  }
};

export const createTermsAndConditions = async (req, res, next) => {
  try {
    const { content, version } = req.body;
    if (!content || !version) {
      throw createError(400, 'Content and version are required');
    }
    const terms = new TermsAndConditions({ content, version });
    await terms.save();
    res.status(201).json({ message: 'Terms and Conditions created successfully', terms });
  } catch (error) {
    logError(error, 'createTermsAndConditions');
    next(error);
  }
};

export const getTermsAndConditions = async (req, res, next) => {
  try {
    const terms = await TermsAndConditions.findOne().sort({ lastUpdated: -1 });
    res.status(200).json(terms || {});
  } catch (error) {
    logError(error, 'getTermsAndConditions');
    next(error);
  }
};

export const updateTermsAndConditions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, version } = req.body;
    const terms = await TermsAndConditions.findByIdAndUpdate(
      id,
      { content, version, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );
    if (!terms) {
      throw createError(404, 'Terms and Conditions not found');
    }
    res.status(200).json({ message: 'Terms and Conditions updated successfully', terms });
  } catch (error) {
    logError(error, 'updateTermsAndConditions');
    next(error);
  }
};

export const deleteTermsAndConditions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const terms = await TermsAndConditions.findByIdAndDelete(id);
    if (!terms) {
      throw createError(404, 'Terms and Conditions not found');
    }
    res.status(200).json({ message: 'Terms and Conditions deleted successfully' });
  } catch (error) {
    logError(error, 'deleteTermsAndConditions');
    next(error);
  }
};

export const createHelpFAQ = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      throw createError(400, 'Question and answer are required');
    }
    const faq = new HelpFAQ({ question, answer });
    await faq.save();
    res.status(201).json({ message: 'Help FAQ created successfully', faq });
  } catch (error) {
    logError(error, 'createHelpFAQ');
    next(error);
  }
};

export const getHelpFAQs = async (req, res, next) => {
  try {
    const faqs = await HelpFAQ.find().sort({ createdAt: -1 });
    res.status(200).json(faqs);
  } catch (error) {
    logError(error, 'getHelpFAQs');
    next(error);
  }
};

export const updateHelpFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    const faq = await HelpFAQ.findByIdAndUpdate(
      id,
      { question, answer, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!faq) {
      throw createError(404, 'Help FAQ not found');
    }
    res.status(200).json({ message: 'Help FAQ updated successfully', faq });
  } catch (error) {
    logError(error, 'updateHelpFAQ');
    next(error);
  }
};

export const deleteHelpFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;
    const faq = await HelpFAQ.findByIdAndDelete(id);
    if (!faq) {
      throw createError(404, 'Help FAQ not found');
    }
    res.status(200).json({ message: 'Help FAQ deleted successfully' });
  } catch (error) {
    logError(error, 'deleteHelpFAQ');
    next(error);
  }
};

export const createPrivacyPolicy = async (req, res, next) => {
  try {
    const { content, version } = req.body;
    if (!content || !version) {
      throw createError(400, 'Content and version are required');
    }
    const policy = new PrivacyPolicy({ content, version });
    await policy.save();
    res.status(201).json({ message: 'Privacy Policy created successfully', policy });
  } catch (error) {
    logError(error, 'createPrivacyPolicy');
    next(error);
  }
};

export const getPrivacyPolicy = async (req, res, next) => {
  try {
    const policy = await PrivacyPolicy.findOne().sort({ lastUpdated: -1 });
    res.status(200).json(policy || {});
  } catch (error) {
    logError(error, 'getPrivacyPolicy');
    next(error);
  }
};

export const updatePrivacyPolicy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, version } = req.body;
    const policy = await PrivacyPolicy.findByIdAndUpdate(
      id,
      { content, version, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );
    if (!policy) {
      throw createError(404, 'Privacy Policy not found');
    }
    res.status(200).json({ message: 'Privacy Policy updated successfully', policy });
  } catch (error) {
    logError(error, 'updatePrivacyPolicy');
    next(error);
  }
};

export const deletePrivacyPolicy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const policy = await PrivacyPolicy.findByIdAndDelete(id);
    if (!policy) {
      throw createError(404, 'Privacy Policy not found');
    }
    res.status(200).json({ message: 'Privacy Policy deleted successfully' });
  } catch (error) {
    logError(error, 'deletePrivacyPolicy');
    next(error);
  }
};