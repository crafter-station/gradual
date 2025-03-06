export function generateWaitlistTemplate(
  title: string,
  description: string,
  importantMessage: string,
) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
        body {
          background-color: #1c1c1c;
          color: #e0e0e0;
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        .container {
          max-width: 480px;
          margin: 0 auto;
          background: #2a2a2a;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
        }
        h1 {
          font-size: 24px;
          color: #ffffff;
        }
        p {
          font-size: 16px;
          color: #b0b0b0;
        }
        .message {
          font-size: 14px;
          color: #d0d0d0;
          margin-top: 10px;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${title}</h1>
        <p>${description}</p>
        <p class="message">${importantMessage}</p>
      </div>
    </body>
  </html>
  `;
}
