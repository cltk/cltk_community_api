import nodemailer from 'nodemailer';
import path from 'path';
import winston from 'winston';
import { EmailTemplate } from 'email-templates';

/**
 * Class for managing sending emails
 * @constructor
 */
class EmailManager {

	/**
	 * Setup the email transporter via smtp config
	 */
	setupTransport() {
		this.from = process.env.EMAIL_FROM;

		const smtpConfig = {
			host: process.env.EMAIL_SMTP_HOST,
			port: process.env.EMAIL_SMTP_PORT,
			secure: process.env.EMAIL_SMTP_SECURE,
			auth: {
				user: process.env.EMAIL_SMTP_USER,
				pass: process.env.EMAIL_SMTP_PASSWORD
			},
			logger: false,
			debug: false // include SMTP traffic in the logs
		};

		// Create a SMTP transporter object
		const transporter = nodemailer.createTransport(smtpConfig);

		// Use handlebars for generating templates
		transporter.use('compile', hbs({
			viewPath: 'server/email/templates',
		}));

		// verify connection configuration
		transporter.verify((error, success) => {
			if (error) {
				console.log('Failed to connect to SMTP server');
				console.log(error);
			} else {
				console.log('Connection to SMTP server successful');
			}
		});

		this.transporter = transporter;

		const email = {
			from: this.from,
			to: 'test@cltk.org',
			subject: 'Test',
			html: '<b>Hello</b>',
			text: 'results.text',
		};

		/*
		TODO: when appropriate, add functionality for actually sending the message
		transporter.sendMail(email, (error, info) => {
			console.log('error', error);
			console.log('info', info);
		});
		*/
	}

	/**
	 * Send a verification email to a user after they have signed up
	 */
	sendVerificationEmail(username) {
		const templateDir = path.resolve(__dirname, 'templates', 'emailVerification');
		const template = new EmailTemplate(templateDir);

		template.render({})
			.then((results) => {
				const email = {
					from: this.from,
					to: username,
					subject: results.subject,
					text: results.text,
				};
				this.transporter.sendMail(email);
			});
	}
}

export default EmailManager;
