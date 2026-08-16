import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'leontestvirtual1@gmail.com',
    pass: 'SMTP_PASS_REDACTED'
  }
});

console.log('Verificando conexión SMTP con Gmail...');
transporter.verify().then(() => {
  console.log('✅ Conexión SMTP verificada exitosamente con Google!');
  return transporter.sendMail({
    from: '"Sysget Saber" <leontesvirtual1@gmail.com>',
    to: 'leontesvirtual1@gmail.com',
    subject: '🔔 [OFICIAL] Sistema de Aprobación de Cuentas — Sysget Saber',
    html: `
      <div style="font-family:sans-serif;background:#0f172a;color:#fff;padding:30px;border-radius:12px;">
        <h2 style="color:#a5b4fc;">🎓 Sysget Saber — Google SMTP Activo</h2>
        <p>Tu contraseña de aplicación de Google ha sido validada con éxito.</p>
        <p>A partir de este momento, cada vez que un nuevo docente o establecimiento se registre, recibirás la notificación inmediata en esta casilla.</p>
        <div style="margin-top:20px;padding:15px;background:#1e293b;border-radius:8px;border:1px solid #334155;">
          <strong>Super Admin:</strong> Luis Andrés León González<br/>
          <strong>Servidor:</strong> smtp.gmail.com (SSL 465)
        </div>
      </div>
    `
  });
}).then(info => {
  console.log('🎉 ¡CORREO ENVIADO CON ÉXITO A leontesvirtual1@gmail.com! MessageId:', info.messageId);
}).catch(err => {
  console.error('❌ Error SMTP:', err);
});
