/**
 * @preserve
 * Sharer.js
 *
 * @description Create your own social share buttons
 * @version 0.3.7
 * @author Ellison Leao <ellisonleao@gmail.com>
 * @license GPLv3
 *
 */

  /**
  * Added startsWith polyfill
  */
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (string, position) {
      const startPosition = position || 0;
      return this.indexOf(string, startPosition) === startPosition;
    };
  }
  /**
   * @constructor
   */
  const Sharer = function (elem, options) {
    this.elem = elem;
    this.options = options;
    if (!this.options || !this.options.url || !this.options.provider) {
      throw new Error('URL and Provider are required options!');
    }
    this.elem.addEventListener('click', () => {
      this.share();
    });
  };

  // instance methods
  Sharer.prototype = {
    constructor: Sharer,
    /**
     *  @function setValue
     *  @description Updates the value of a given option
     *  @param {String} name name of the option
     *  @returns {Empty}
     */
     setValue: function (name, value) {
       this.options[name] = value;
     },
    /**
     *  @function destroy
     *  @description Remove click handler for element
     *  @param {String} attr DOM element attribute
     *  @returns {String|Empty} returns the attr value or empty string
     */
    destroy: function () {
      this.elem.removeEventListener('click', this.share)
    },
    /**
     *  @function getValue
     *  @description Helper to get the attribute of a DOM element
     *  @param {String} attr DOM element attribute
     *  @returns {String|Empty} returns the attr value or empty string
     */
    getValue: function (name) {
      const val = this.options[name];
      // handing facebook hashtag attribute
      if (val && name === 'hashtag' && this.options.provider.toLowerCase() === 'facebook') {
        if (!val.startsWith('#')) {
          return `#${val}`;
        }
      }
      return val;
    },
    /**
     * @event share
     * @description Main share event. Will pop a window or redirect to a link
     * based on the data-sharer attribute.
     */
    share: function () {
      const provider = this.options.provider.toLowerCase();
      const sharers = {
        facebook: {
          shareUrl: 'https://www.facebook.com/sharer/sharer.php',
          params: {
            u: this.getValue('url'),
            hashtag: this.getValue('hashtag')
          }
        },
        linkedin: {
          shareUrl: 'https://www.linkedin.com/shareArticle',
          params: {
            url: this.getValue('url'),
            mini: true
          }
        },
        twitter: {
          shareUrl: 'https://twitter.com/intent/tweet/',
          params: {
            text: this.getValue('title'),
            url: this.getValue('url'),
            hashtag: this.getValue('hashtag'),
            via: this.getValue('via')
          }
        },
        email: {
          shareUrl: 'mailto:' + this.getValue('to') || '',
          params: {
            subject: this.getValue('subject'),
            body: `${this.getValue('title')}\n<a href="${this.getValue('url')}">${this.getValue('url')}</a>`
          },
          isLink: true
        },
        gmail: {
          shareUrl: 'https://mail.google.com/mail/',
          params: {
            view: 'cm',
            to: this.getValue('to'),
            su: this.getValue('subject'),
            body: `${this.getValue('title')}\n${this.getValue('url')}`
          }
        },
        reddit: {
          shareUrl: 'https://www.reddit.com/submit',
          params: { url: this.getValue('url') }
        }
      };
      const sharer = sharers[provider];

      // custom popups sizes
      if (sharer) {
        sharer.width = this.getValue('width');
        sharer.height = this.getValue('height');
      }
      return sharer !== undefined ? this.urlSharer(sharer) : false;
    },
    /**
     * @event urlSharer
     * @param {Object} sharer
     */
    urlSharer: function (sharer) {
        const params = sharer.params || {};
        const keys = Object.keys(params);
        if (keys.length > 0) {
          sharer.shareUrl += '?' + keys.filter(key => !!params[key]).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
        }

        if (!sharer.isLink) {
          const popWidth = sharer.width || 600;
          const popHeight = sharer.height || 480;
          const left = window.innerWidth / 2 - popWidth / 2 + window.screenX;
          const top = window.innerHeight / 2 - popHeight / 2 + window.screenY;
          const popParams = `scrollbars=no, width=${popWidth}, height=${popHeight}, top=${top}, left=${left}`;
          const newWindow = window.open(sharer.shareUrl, '', popParams);
          if (window.focus) {
            newWindow.focus();
          }
        } else {
          window.location.href = sharer.shareUrl;
        }
      }
  };

function SocialSharerDirective () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      const sharer = new Sharer(element[0], {
        provider: attrs.socialSharer,
        title: attrs.socialSharerTitle,
        url: attrs.socialSharerUrl,
        width: attrs.socialSharerWidth,
        height: attrs.socialSharerHeight,
        web: attrs.socialSharerWeb,
        hashtag: attrs.socialSharerHashtag,
        via: attrs.socialSharerVia,
        subject: attrs.socialSharerSubject,
        to: attrs.socialSharerTo,
        image: attrs.socialSharerImage,
        description: attrs.socialSharerDescription,
      });
      let observers = [];

      observers.push(attrs.$observe('socialSharerTitle', (value) => {
        sharer.setValue('title', value);
      }));
      observers.push(attrs.$observe('socialSharerUrl', (value) => {
        sharer.setValue('url', value);
      }));
      observers.push(attrs.$observe('socialSharerTo', (value) => {
        sharer.setValue('to', value);
      }));

      scope.$on('$destroy', () => {
        sharer.destroy();
        observers.forEach(f => { f() });
      });
    }
  };
}
const ngSharer = angular.module('wisbooSocialSharer', [])
                        .directive('socialSharer', SocialSharerDirective);
module.exports = ngSharer;
