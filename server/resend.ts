import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  
  console.log('[Resend] Checking credentials...');
  console.log('[Resend] REPLIT_CONNECTORS_HOSTNAME:', hostname ? 'present' : 'missing');
  console.log('[Resend] REPL_IDENTITY:', process.env.REPL_IDENTITY ? 'present' : 'missing');
  console.log('[Resend] WEB_REPL_RENEWAL:', process.env.WEB_REPL_RENEWAL ? 'present' : 'missing');
  
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    console.error('[Resend] X_REPLIT_TOKEN not found for repl/depl');
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  try {
    const response = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    );
    
    console.log('[Resend] Fetch response status:', response.status);
    
    const data = await response.json();
    console.log('[Resend] Response data:', JSON.stringify(data, null, 2));
    
    connectionSettings = data.items?.[0];

    if (!connectionSettings || !connectionSettings.settings?.api_key) {
      console.error('[Resend] Connection settings missing or incomplete:', connectionSettings);
      throw new Error('Resend not connected or missing API key');
    }
    
    console.log('[Resend] Credentials retrieved successfully');
    
    let fromEmail = connectionSettings.settings.from_email;
    
    if (fromEmail && fromEmail.includes('@myyahoo.com')) {
      fromEmail = 'onboarding@resend.dev';
      console.log('[Resend] Using Resend test domain for unverified sender');
    }
    
    return {
      apiKey: connectionSettings.settings.api_key, 
      fromEmail: fromEmail || 'onboarding@resend.dev'
    };
  } catch (error) {
    console.error('[Resend] Error fetching credentials:', error);
    throw error;
  }
}

async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export async function sendPasswordResetEmail(toEmail: string, resetLink: string) {
  console.log('[Resend] Attempting to send password reset email to:', toEmail);
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    console.log('[Resend] Client initialized, from email:', fromEmail);
    
    const { data, error } = await client.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: 'Reset Your CalculateThis.org Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">Reset Your Password</h2>
          <p>You requested to reset your password for CalculateThis.org.</p>
          <p>Click the link below to reset your password:</p>
          <p style="margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            ${resetLink}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend] ❌ Error from Resend API:', error);
      throw error;
    }

    console.log('[Resend] ✅ Password reset email sent successfully to:', toEmail);
    console.log('[Resend] Email ID:', data?.id);
    return true;
  } catch (error) {
    console.error('[Resend] ❌ Error sending password reset email:', error);
    throw error;
  }
}
