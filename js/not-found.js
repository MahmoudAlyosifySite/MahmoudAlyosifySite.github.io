/* 404 page — web addresses on GitHub Pages are case-sensitive, and people
   type them from memory. The ones worth catching are sent to where they
   were meant to go. Destinations come only from the fixed table below. */
(function () {
  var path;
  try { path = decodeURIComponent(location.pathname); } catch (e) { path = location.pathname; }
  path = path.toLowerCase().replace(/\/index\.html$/, '').replace(/\/+$/, '');
  var to = {
    '/cv': '/cv/', '/cvs': '/cv/', '/cv.html': '/cv/', '/resume': '/cv/', '/resumes': '/cv/', '/resume.html': '/cv/',
    '/mahmoud-cv': '/cv/', '/mahmoud-alyosify-cv': '/cv/', '/mahmoudalyosify-cv': '/cv/', '/mahmoudalyosify.cv': '/cv/',
    '/mahmoud resumes': '/cv/',
    '/ar': '/ar/', '/arabic': '/ar/', '/عربي': '/ar/', '/العربية': '/ar/',
    '/bio': '/biography/', '/biography': '/biography/', '/about': '/biography/'
  }[path];
  if (to && location.pathname !== to) location.replace(to + location.search + location.hash);
})();
