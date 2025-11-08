const Notification = require('../models/Notification');

class NotificationService {
  /**
   * Create in-app notification
   * @param {String} recipientId - User ID
   * @param {String} type - Notification type
   * @param {String} title - Notification title
   * @param {String} message - Notification message
   * @param {Object} data - Additional data
   * @returns {Object} Created notification
   */
  async createNotification(recipientId, type, title, message, data = {}) {
    try {
      const notification = await Notification.create({
        recipient: recipientId,
        type,
        title,
        message,
        data
      });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Create application received notification
   */
  async notifyApplicationReceived(employerId, candidateName, jobTitle, applicationId, jobId, candidateId) {
    return this.createNotification(
      employerId,
      'application_received',
      'New Job Application',
      `${candidateName} applied for ${jobTitle}`,
      { applicationId, jobId, candidateId }
    );
  }

  /**
   * Create invitation received notification
   */
  async notifyInvitationReceived(candidateId, jobTitle, invitationId, jobId) {
    return this.createNotification(
      candidateId,
      'invitation_received',
      'New Job Invitation',
      `You have received an invitation for ${jobTitle}`,
      { invitationId, jobId }
    );
  }

  /**
   * Create application status update notification
   */
  async notifyApplicationStatusUpdate(candidateId, jobTitle, status, applicationId, jobId) {
    return this.createNotification(
      candidateId,
      'application_status_update',
      'Application Status Updated',
      `Your application for ${jobTitle} has been ${status}`,
      { applicationId, jobId }
    );
  }

  /**
   * Create invitation response notification
   */
  async notifyInvitationResponse(employerId, candidateName, jobTitle, accepted, invitationId, jobId, candidateId) {
    const action = accepted ? 'accepted' : 'declined';
    return this.createNotification(
      employerId,
      'invitation_response',
      `Invitation ${accepted ? 'Accepted' : 'Declined'}`,
      `${candidateName} ${action} your invitation for ${jobTitle}`,
      { invitationId, jobId, candidateId }
    );
  }

  /**
   * Send email notification (future implementation with SendGrid)
   * @param {String} email - Recipient email
   * @param {String} template - Email template name
   * @param {Object} data - Template data
   */
  async sendEmailNotification(email, template, data) {
    // Future implementation with SendGrid
    console.log(`Email notification would be sent to ${email} using template ${template}`);
    return Promise.resolve();
  }
}

module.exports = new NotificationService();
