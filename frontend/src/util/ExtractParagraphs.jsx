export function extractParagraphs(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const paragraphs = doc.querySelectorAll('p');
    
    const filteredParagraphs = Array.from(paragraphs)
      .filter(p => !p.querySelector('img'))
      .map(p => p.outerHTML)
      .join('');
    return filteredParagraphs;
  } 