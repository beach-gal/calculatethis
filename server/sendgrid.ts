import sgMail from '@sendgrid/mail';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  
  console.log('[SendGrid] Checking credentials...');
  console.log('[SendGrid] REPLIT_CONNECTORS_HOSTNAME:', hostname ? 'present' : 'missing');
  console.log('[SendGrid] REPL_IDENTITY:', process.env.REPL_IDENTITY ? 'present' : 'missing');
  console.log('[SendGrid] WEB_REPL_RENEWAL:', process.env.WEB_REPL_RENEWAL ? 'present' : 'missing');
  
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    console.error('[SendGrid] X_REPLIT_TOKEN not found for repl/depl');
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  try {
    const response = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=sendgrid',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    );
    
    console.log('[SendGrid] Fetch response status:', response.status);
    
    const data = await response.json();
    console.log('[SendGrid] Response data:', JSON.stringify(data, null, 2));
    
    connectionSettings = data.items?.[0];

    if (!connectionSettings || (!connectionSettings.settings?.api_key || !connectionSettings.settings?.from_email)) {
      console.error('[SendGrid] Connection settings missing or incomplete:', connectionSettings);
      throw new Error('SendGrid not connected or missing API key/from_email');
    }
    
    console.log('[SendGrid] Credentials retrieved successfully');
    return {apiKey: connectionSettings.settings.api_key, email: connectionSettings.settings.from_email};
  } catch (error) {
    console.error('[SendGrid] Error fetching credentials:', error);
    throw error;
  }
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableSendGridClient() {
  const {apiKey, email} = await getCredentials();
  sgMail.setApiKey(apiKey);
  return {
    client: sgMail,
    fromEmail: email
  };
}

export async function sendPasswordResetEmail(toEmail: string, resetLink: string) {
  console.log('[SendGrid] Attempting to send password reset email to:', toEmail);
  try {
    const { client, fromEmail } = await getUncachableSendGridClient();
    console.log('[SendGrid] Client initialized, from email:', fromEmail);
    
    const msg = {
      to: toEmail,
      from: fromEmail,
      subject: 'Reset Your CalculateThis.org Password',
      text: `You requested to reset your password. Click the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>You requested to reset your password for CalculateThis.org.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Your Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetLink}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this password reset, please ignore this email.</p>
        </div>
      `,
    };
    
    await client.send(msg);
    console.log('[SendGrid] ✅ Password reset email sent successfully to:', toEmail);
    return true;
  } catch (error) {
    console.error('[SendGrid] ❌ Error sending password reset email:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const sgError = error as any;
      console.error('[SendGrid] SendGrid response:', sgError.response?.body);
    }
    throw error;
  }
}
