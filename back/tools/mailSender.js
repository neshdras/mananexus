const { BrevoClient} = require('@getbrevo/brevo')

const client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
})

async function mailSender(token, email) {
        try {
        await client.transactionalEmails.sendTransacEmail({
        to: [{ email }],
        sender: { email: 'shufflenexus@gmail.com', name: 'Shuffle Nexus' },
        subject: 'Password reset - forgotten password',
        textContent: `Hello player,

        We received a reset password request for your Shuffle Nexus account.

        Click on this link to reset your password : ${process.env.URL_WEBSITE}/resetpass/${token} !

        This link will work only for the next 10 minutes !
        
        If you aren't the person who ask for this, please ignore that message.
        `
        });
    } catch (error) {
        throw new Error('Failed : email did not sent');
    }
}

module.exports = mailSender