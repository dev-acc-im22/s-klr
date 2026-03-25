export function HydrationScript() {
  const code = `
(function() {
  var html = document.documentElement;
  
  // Set theme immediately from localStorage BEFORE React hydrates
  try {
    var themeData = localStorage.getItem('theme');
    if (themeData) {
      var parsed = JSON.parse(themeData);
      var theme = parsed?.state?.theme || 'system';
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      html.classList.add('dark');
    }
  } catch(e) {}
  
  // DO NOT set visibility here - let HydrationProvider handle it
  // The html starts with visibility:hidden via inline style
  // HydrationProvider will add 'hydrated' class when ready
})();
`;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      suppressHydrationWarning
    />
  );
}
