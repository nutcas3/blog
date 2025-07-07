import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'lineBreakToParagraph',
  standalone: true
})
export class LineBreakToParagraphPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';
    
    // Replace markdown-style code blocks with HTML
    let formatted = value.replace(/```([a-z]*)\n([\s\S]*?)\n```/g, (match, language, code) => {
      return `<pre><code class="language-${language}">${this.escapeHtml(code)}</code></pre>`;
    });
    
    // Replace markdown-style headers
    formatted = formatted.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Replace markdown-style links
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Replace markdown-style bold and italic
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Replace double line breaks with paragraph tags
    formatted = '<p>' + formatted.replace(/\n\s*\n/g, '</p><p>') + '</p>';
    
    // Replace single line breaks with <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Return sanitized HTML
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }
  
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
