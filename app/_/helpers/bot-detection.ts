const botUserAgentPattern =
  /bot|crawler|spider|discordbot|twitterbot|facebookexternalhit|facebot|meta-externalagent|googlebot|google-inspectiontool|bingbot|slurp|duckduckbot|baiduspider|yandexbot|linkedinbot|embedly|quora link preview|slackbot|telegrambot|whatsapp|applebot|ia_archiver|gptbot|chatgpt-user|bytespider/i;

export function isBotUserAgent(userAgent: string): boolean {
  if (userAgent.trim().length === 0) {
    return false;
  }

  return botUserAgentPattern.test(userAgent);
}
