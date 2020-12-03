const defaultFontFamily = [
    'inherit',
    'Georgia, serif',
    '\'Palatino Linotype\', \'Book Antiqua\', Palatino, serif',
    '\'Times New Roman\', Times, serif',
    'Arial, Helvetica, sans-serif',
    '\'Arial Black\', Gadget, sans-serif',
    '\'Comic Sans MS\', cursive, sans-serif',
    'Impact, Charcoal, sans-serif',
    '\'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif',
    'Tahoma, Geneva, sans-serif',
    '\'Trebuchet MS\', Helvetica, sans-serif',
    'Verdana, Geneva, sans-serif',
    '\'Courier New\', Courier, monospace',
    '\'Lucida Console\', Monaco, monospace'
];
// Vue.config.devtools = true
const confs = {
    storage: {
        /**
         * Get Email from localStorage
         */
        get: function () {
            return new Promise(function (resolve, reject) {
                try {
                    let email = JSON.parse(localStorage.getItem('jqueryEmail')) || {
                        // name: 'New Email',
                        elements: [],
                        html: '',
                        emailSettings: {
                            options: {
                                paddingTop: "50px",
                                paddingLeft: "5px",
                                paddingBottom: "50px",
                                paddingRight: "5px",
                                backgroundColor: "#cccccc"
                            },
                            type: 'emailSettings'
                        }
                    };
                    // Emulate response from server
                    setTimeout(function () {
                        resolve(email)
                    }, 300)
                } catch (e) {
                    utils.notify(e).error();
                    reject(e)
                }
            });
        },

        /**
         * Put changed data in Email
         * Emulate server storage with Promise
         * @param email
         * @returns {Promise}
         */
        put: function (email) {
            return new Promise(function (resolve, reject) {
                try {
                    // Remove multine breaks
                    email.html = utils.removeLineBreaks(email.html);
                    localStorage.setItem('jqueryEmail', JSON.stringify(email));
                    resolve()
                } catch (e) {
                    utils.notify(e).error();
                    reject(e)
                }
            })
        }
    },
    options: {
        urlToUploadImage: '//uploads.im/api',
        trackEvents: false, // You need to add google analytics in index.html
        mjmlPublicKey: '961d11e0-9ddc-47ed-95c6-825951e60d14',
        mjmlApplicationId: '17ba7701-c1aa-48ba-8407-443505ae5d43',
        assetsPath: 'http://localhost:9000/assets'
    }
};

let utils = {
    /**
     * Convert string from snake to camel
     * @param str
     * @returns {*}
     */
    snakeToCamel: function (str) {
        if (typeof str !== 'string') return str;
        return str.replace(/_([a-z])/gi, function (m, w) {
            return "" + w.toUpperCase();
        });
    },
    /**
     * Convert camel to snake
     * @param str
     * @returns {*}
     */
    camelToSnake: function (str) {
        if (typeof str !== 'string') return str;
        return str.replace(/([A-Z])/g, function (m, w) {
            return "_" + w.toLowerCase();
        });
    },
    /**
     * Generate random id
     * @param prefix
     * @returns {string}
     */
    uid: function (prefix) {
        return (prefix || 'id') + (new Date().getTime()) + "RAND" + (Math.ceil(Math.random() * 100000));
    },
    createEmail: function (email) {
        email = email || {}; // I know, is ugly, but is supported in es5
        let compileMjmlObject = {
            tagName: 'mjml',
            children: [{
                tagName: 'mj-head',
                children: [{
                    tagName: 'mj-title',
                    content: email.name
                },
                {
                    tagName: 'mj-style',
                    attributes: {},
                    content: '@media all and (max-width: 480px) { td { width: 100%!important; } } iframe { width: 100%!important; }'
                }
                ]
            },
            {
                tagName: 'mj-body',
                attributes: {},
                children: [{
                    tagName: 'mj-container',
                    attributes: {
                        'background-color': email.emailSettings.options.backgroundColor
                    },
                    children: [{
                        tagName: 'mj-wrapper',
                        attributes: {
                            'padding-top': email.emailSettings.options.paddingTop,
                            'padding-right': email.emailSettings.options.paddingRight,
                            'padding-bottom': email.emailSettings.options.paddingBottom,
                            'padding-left': email.emailSettings.options.paddingLeft,
                        },
                        children: email.elements.map(element => {
                            switch (element.type) {
                                case 'title':
                                    return {
                                        tagName: 'mj-section',
                                        attributes: {
                                            'full-width': 'full-width',
                                            'background-color': element.options.backgroundColor,
                                            'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                        },
                                        children: [{
                                            tagName: 'mj-column',
                                            attributes: {
                                                'width': '100%'
                                            },
                                            children: [{
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'color': element.options.color,
                                                    'align': element.options.align,
                                                    'padding': 0,
                                                    'font-family': element.options.font.family,
                                                    'line-height': 0
                                                },
                                                content: `<h1 style="font-weight: ${element.options.font.weight};font-size: 32px;line-height: 1;margin: 0;">${element.options.title}</h1>`
                                            }]
                                        },
                                        {
                                            tagName: 'mj-column',
                                            attributes: {
                                                'width': '100%'
                                            },
                                            children: [{
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'color': element.options.color,
                                                    'align': element.options.align,
                                                    'padding': 0,
                                                    'font-family': element.options.font.family
                                                },
                                                content: `<h4 style="font-weight: ${element.options.font.weight};margin-bottom: 0;font-size: 16px;">${element.options.subTitle}</h4>`
                                            }]
                                        }
                                        ]
                                    }

                                case 'button':
                                    return {
                                        tagName: 'mj-section',
                                        attributes: {
                                            'full-width': 'full-width',
                                            'background-color': element.options.backgroundColor,
                                            'padding': 0
                                        },
                                        children: [{
                                            tagName: 'mj-column',
                                            attributes: {
                                                'width': '100%'
                                            },
                                            children: [{
                                                tagName: 'mj-button',
                                                attributes: {
                                                    'align': element.options.align,
                                                    'border': `${element.options.border.size}px ${element.options.border.style} ${element.options.border.color}`,
                                                    'border-radius': `${element.options.border.radius}px`,
                                                    'background-color': element.options.buttonBackgroundColor,
                                                    'font-family': `${element.options.font.family}`,
                                                    'color': element.options.font.color,
                                                    'font-size': `${element.options.font.size}px`,
                                                    'font-weight': element.options.font.weight,
                                                    'width': Boolean(element.options.fullWidth) ? '100%' : 'auto',
                                                    'padding': `${element.options.margin[0]} ${element.options.margin[1]} ${element.options.margin[2]} ${element.options.margin[3]}`,
                                                    'inner-padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`,
                                                    'href': element.options.url
                                                },
                                                content: element.options.buttonText
                                            }]
                                        }]
                                    }
                                case 'text':
                                    return {
                                        tagName: 'mj-section',
                                        attributes: {
                                            'full-width': 'full-width',
                                            'background-color': element.options.backgroundColor,
                                            'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                        },
                                        children: [{
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'font-size': '13px',
                                                    'color': 'rgb(0, 0, 0)',
                                                    'line-height': '20px',
                                                    'padding': 0,
                                                    'font-family': element.options.font.family
                                                },
                                                content: element.options.text
                                            }]
                                        }]
                                    }
                                case 'divider':
                                    return {
                                        tagName: 'mj-section',
                                        attributes: {
                                            'full-width': 'full-width',
                                            'padding': 0
                                        },
                                        children: [{
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-divider',
                                                attributes: {
                                                    'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`,
                                                    'container-background-color': element.options.backgroundColor,
                                                    'border-width': `${element.options.border.size}px`,
                                                    'border-style': `${element.options.border.style}`,
                                                    'border-color': `${element.options.border.color}`
                                                }
                                            }]
                                        }]
                                    }

                                case 'image':
                                    return {
                                        tagName: 'mj-section',
                                        attributes: {
                                            'full-width': 'full-width',
                                            'background-color': element.options.backgroundColor,
                                            'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                        },
                                        children: [{
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-image',
                                                attributes: {
                                                    'align': element.options.align,
                                                    'src': element.options.image,
                                                    'alt': element.options.altTag,
                                                    'width': element.options.width,
                                                    'padding': 0,
                                                    'href': element.options.linkTo.type === 'link' && element.options.linkTo.link || element.options.linkTo.type === 'email' && `mailto:${element.options.linkTo.link}` || null
                                                }
                                            }]
                                        }]
                                    }
                                case 'imageTextRight':
                                    return {
                                        tagName: 'mj-section',
                                        attributes: {
                                            'full-width': 'full-width',
                                            'background-color': element.options.backgroundColor,
                                            'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                        },
                                        children: [{
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-image',
                                                attributes: {
                                                    'align': element.options.align,
                                                    'src': element.options.image,
                                                    'alt': element.options.altTag,
                                                    'padding': 0,
                                                    'padding-right': '5px',
                                                    'width': element.options.width,
                                                    'href': element.options.linkTo.type === 'link' && element.options.linkTo.link || element.options.linkTo.type === 'email' && `mailto:${element.options.linkTo.link}` || null
                                                }
                                            }]
                                        },
                                        {
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'font-size': '13px',
                                                    'color': 'rgb(0, 0, 0)',
                                                    'line-height': '20px',
                                                    'padding': 0,
                                                    'padding-left': '5px',
                                                    'font-family': 'Arial, sans-serif'
                                                    // 'font-family': element.options.font.family
                                                },
                                                content: element.options.text
                                            }]
                                        }
                                        ]
                                    }
                                case 'imageTextLeft':
                                    return {
                                        tagName: 'mj-section',
                                        attributes: {
                                            'full-width': 'full-width',
                                            'background-color': element.options.backgroundColor,
                                            'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                        },
                                        children: [{
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'font-size': '13px',
                                                    'color': 'rgb(0, 0, 0)',
                                                    'line-height': '20px',
                                                    'padding': 0,
                                                    'padding-right': '5px',
                                                    'font-family': 'Arial, sans-serif'
                                                    // 'font-family': element.options.font.family
                                                },
                                                content: element.options.text
                                            }]
                                        },
                                        {
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-image',
                                                attributes: {
                                                    'align': element.options.align,
                                                    'src': element.options.image,
                                                    'alt': element.options.altTag,
                                                    'padding': 0,
                                                    'padding-left': '5px',
                                                    'width': element.options.width,
                                                    'href': element.options.linkTo.type === 'link' && element.options.linkTo.link || element.options.linkTo.type === 'email' && `mailto:${element.options.linkTo.link}` || null
                                                }
                                            }]
                                        }
                                        ]
                                    }
                                case 'imageText2x2':
                                    return {
                                        tagName: 'mj-section',
                                        attributes: {
                                            'full-width': 'full-width',
                                            'background-color': element.options.backgroundColor,
                                            'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                        },
                                        children: [{
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-image',
                                                attributes: {
                                                    'src': element.options.image1,
                                                    'alt': element.options.altTag1,
                                                    'padding': '0 5px',
                                                    'width': element.options.width1,
                                                    'href': element.options.linkTo1.type === 'link' && element.options.linkTo1.link || element.options.linkTo1.type === 'email' && `mailto:${element.options.linkTo1.link}` || null
                                                }
                                            },
                                            {
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'font-size': '13px',
                                                    'color': 'rgb(0, 0, 0)',
                                                    'line-height': '20px',
                                                    'padding': '0 5px',
                                                    'font-family': 'Arial, sans-serif'
                                                    // 'font-family': element.options.font.family
                                                },
                                                content: element.options.text1
                                            }
                                            ]
                                        },
                                        {
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-image',
                                                attributes: {
                                                    'src': element.options.image2,
                                                    'alt': element.options.altTag2,
                                                    'padding': '0 5px',
                                                    'width': element.options.width2,
                                                    'href': element.options.linkTo2.type === 'link' && element.options.linkTo2.link || element.options.linkTo2.type === 'email' && `mailto:${element.options.linkTo2.link}` || null
                                                }
                                            },
                                            {
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'font-size': '13px',
                                                    'color': 'rgb(0, 0, 0)',
                                                    'line-height': '20px',
                                                    'padding': '0 5px',
                                                    'font-family': 'Arial, sans-serif'
                                                    // 'font-family': element.options.font.family
                                                },
                                                content: element.options.text2
                                            }
                                            ]
                                        }
                                        ]
                                    }
                                case 'imageText3x2':
                                    return {
                                        tagName: 'mj-section',
                                        attributes: {
                                            'full-width': 'full-width',
                                            'background-color': element.options.backgroundColor,
                                            'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                        },
                                        children: [{
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-image',
                                                attributes: {
                                                    'src': element.options.image1,
                                                    'alt': element.options.altTag1,
                                                    'padding': '0 3px 3px',
                                                    'width': element.options.width1,
                                                    'href': element.options.linkTo1.type === 'link' && element.options.linkTo1.link || element.options.linkTo1.type === 'email' && `mailto:${element.options.linkTo1.link}` || null
                                                }
                                            },
                                            {
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'font-size': '13px',
                                                    'color': 'rgb(0, 0, 0)',
                                                    'line-height': '20px',
                                                    'padding': '0 3px',
                                                    'font-family': 'Arial, sans-serif'
                                                    // 'font-family': element.options.font.family
                                                },
                                                content: element.options.text1
                                            }
                                            ]
                                        },
                                        {
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-image',
                                                attributes: {
                                                    'src': element.options.image2,
                                                    'alt': element.options.altTag2,
                                                    'padding': '0 3px 3px',
                                                    'width': element.options.width2,
                                                    'href': element.options.linkTo2.type === 'link' && element.options.linkTo2.link || element.options.linkTo2.type === 'email' && `mailto:${element.options.linkTo2.link}` || null
                                                }
                                            },
                                            {
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'font-size': '13px',
                                                    'color': 'rgb(0, 0, 0)',
                                                    'line-height': '20px',
                                                    'padding': '0 3px',
                                                    'font-family': 'Arial, sans-serif'
                                                    // 'font-family': element.options.font.family
                                                },
                                                content: element.options.text2
                                            },
                                            ]
                                        },
                                        {
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-image',
                                                attributes: {
                                                    'src': element.options.image3,
                                                    'alt': element.options.altTag3,
                                                    'padding': '0 3px 3px',
                                                    'width': element.options.width3,
                                                    'href': element.options.linkTo3.type === 'link' && element.options.linkTo3.link || element.options.linkTo3.type === 'email' && `mailto:${element.options.linkTo3.link}` || null
                                                }
                                            },
                                            {
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'font-size': '13px',
                                                    'color': 'rgb(0, 0, 0)',
                                                    'line-height': '20px',
                                                    'padding': '0 3px',
                                                    'font-family': 'Arial, sans-serif'
                                                    // 'font-family': element.options.font.family
                                                },
                                                content: element.options.text3
                                            },
                                            ]
                                        }
                                        ]
                                    }
                                case 'social':
                                    let links = '';
                                    Object.keys(element.options.links).forEach(key => {
                                        if (element.options.links[key].active) {
                                            links += `<a href="${element.options.links[key].link}" target="_blank" style="border: none;text-decoration: none;">
                                                        <img border="0" src="${confs.options.assetsPath}/social/${key}.png">
                                                    </a>`
                                        }
                                    })

                                    return {
                                        tagName: 'mj-section',
                                        attributes: {
                                            'full-width': 'full-width',
                                            'background-color': element.options.backgroundColor,
                                            'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                        },
                                        children: [{
                                            tagName: 'mj-column',
                                            attributes: {
                                                'width': '100%'
                                            },
                                            children: [{
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'color': element.options.color,
                                                    'align': element.options.align,
                                                    'padding': 0,
                                                    'font-family': 'Arial, sans-serif',
                                                    'line-height': 0
                                                },
                                                content: links
                                            }]
                                        }]
                                    }
                                case 'video':
                                    let iframe = $(element.options.iframeVideo),
                                        currentWidth = $(element.options.iframeVideo).attr('width');
                                    return {
                                        tagName: 'mj-section',
                                        attributes: {
                                            'full-width': 'full-width',
                                            'background-color': element.options.backgroundColor,
                                            'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                        },
                                        children: [{
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'padding': 0,
                                                    'line-height': 0,
                                                    'font-size': 0
                                                },
                                                content: iframe.attr('width', element.options.fullWidth ? 600 : currentWidth).get(0).outerHTML
                                            }]
                                        }]
                                    }
                                case 'html':
                                    return {
                                        tagName: 'mj-section',
                                        attributes: {
                                            'full-width': 'full-width',
                                            'background-color': 'transparent',
                                            'padding': 0
                                        },
                                        children: [{
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'font-size': '13px',
                                                    'color': 'rgb(0, 0, 0)',
                                                    'line-height': '20px',
                                                    'padding': 0,
                                                },
                                                content: element.options.html
                                            }]
                                        }]
                                    }
                                case 'unsubscribe':
                                    return {
                                        tagName: 'mj-section',
                                        attributes: {
                                            'full-width': 'full-width',
                                            'background-color': element.options.backgroundColor,
                                            'padding': `${element.options.padding[0]} ${element.options.padding[1]} ${element.options.padding[2]} ${element.options.padding[3]}`
                                        },
                                        children: [{
                                            tagName: 'mj-column',
                                            children: [{
                                                tagName: 'mj-text',
                                                attributes: {
                                                    'font-size': '13px',
                                                    'color': 'rgb(0, 0, 0)',
                                                    'line-height': '20px',
                                                    'padding': 0,
                                                    'font-family': element.options.font.family
                                                },
                                                content: element.options.text
                                            }]
                                        }]
                                    }
                                default:
                                    return false;
                            }
                        })
                    }]
                }]
            }
            ]
        }
        return new Promise(function (succesFn, rejectFn) {
            if (!confs.options.mjmlPublicKey || !confs.options.mjmlApplicationId) {
                return rejectFn('You did\'nt include MJML API keys!');
            }
            return $.ajax({
                url: 'https://api.mjml.io/v1/render',
                method: 'POST',
                data: JSON.stringify({
                    mjml: JSON.stringify(compileMjmlObject)
                }),
                datatype: 'json',
                processData: false,
                beforeSend(req) {
                    req.setRequestHeader('Authorization', `Basic ${btoa(`${confs.options.mjmlApplicationId}:${confs.options.mjmlPublicKey}`)}`)
                },
                success(data) {
                    return succesFn(data)
                }
            })
        });
    },

    /**
     * Notify
     * @param msg
     * @param callback
     * @returns {{log: log, success: success, error: error}}
     */
    notify: function (msg, callback) {
        return {
            log: function () {
                return alertify.log(msg, callback)
            },
            success: function () {
                alertify.success(msg, callback)
            },
            error: function () {
                alertify.error(msg, callback)
            }
        }
    },

    /**
     * Confirm dialog
     * @param msg
     * @param succesFn
     * @param cancelFn
     * @param okBtn
     * @param cancelBtn
     * @returns {IAlertify}
     */
    confirm: function (msg, succesFn, cancelFn, okBtn, cancelBtn) {
        return alertify
            .okBtn(okBtn)
            .cancelBtn(cancelBtn)
            .confirm(msg, succesFn, cancelFn)
    },

    /**
     * Alert dialog
     * @param msg
     * @returns {IAlertify}
     */
    alert: function (msg) {
        return alertify
            .okBtn("Accept")
            .alert(msg)
    },

    /**
     * Prompt dialog
     * @param defaultvalue
     * @param promptMessage
     * @param successFn
     * @param cancelFn
     * @returns {IAlertify}
     */
    prompt: function (defaultvalue, promptMessage, successFn, cancelFn) {
        return alertify
            .defaultValue(defaultvalue)
            .prompt(promptMessage, successFn, cancelFn)
    },

    /**
     * Validate email before save and import
     * @param emailToValidate
     * @returns {boolean}
     */
    validateEmail: function (emailToValidate) {
        return Vue.util.isObject(emailToValidate) &&
            $.isArray(emailToValidate.elements) &&
            typeof emailToValidate.html === 'string' &&
            Vue.util.isObject(emailToValidate.emailSettings) &&
            emailToValidate.emailSettings.type === 'emailSettings' &&
            Vue.util.isObject(emailToValidate.emailSettings.options)
    },

    /**
     * Track events with Google Analytics
     * @param category
     * @param event
     * @param name
     * @returns {*}
     */
    trackEvent: function (category, event, name) {
        if (confs.trackEvents) {
            if (!ga)
                throw new Error('To track events, include Google analytics code in index.html');
            return ga('send', 'event', category, event, name);
        }
    },
    equals: function (obj1, obj2) {
        function _equals(obj1, obj2) {
            let clone = $.extend(true, {}, obj1),
                cloneStr = JSON.stringify(clone);
            return cloneStr === JSON.stringify($.extend(true, clone, obj2));
        }

        return _equals(obj1, obj2) && _equals(obj2, obj1);
    },
    removeLineBreaks: function (html) {
        return html.replace(/\n\s*\n/gi, '\n');
    },
    initTooltips: function () {
        setTimeout(function () {
            $('i[title]').powerTip({
                placement: 'sw-alt' // north-east tooltip position
            });
        }, 100)
    }
};
new Vue({
    data: function () {
        return {
            loading: true
        }
    },
    components: {
        'email-builder-component': function (resolve, reject) {
            Promise.all([$.get('builder/builder.html'), confs.storage.get()]).then(function (data) {
                resolve({
                    data: function () {
                        return {
                            preview: false,
                            currentElement: {},
                            selectedNetwork: '',
                            elements: [{
                                type: 'title',
                                icon: '&#xE165;',
                                primary_head: 'Title',
                                second_head: 'And subtitle'
                            },
                            {
                                type: 'divider',
                                icon: '&#xE8E9;',
                                primary_head: 'Divider',
                                second_head: '1px separation line'
                            },
                            {
                                type: 'text',
                                icon: '&#xE8EE;',
                                primary_head: 'Text',
                                second_head: 'Editable text box'
                            },
                            {
                                type: 'html',
                                icon: 'code',
                                primary_head: 'HTML',
                                second_head: 'Editable HTML box'
                            },
                            {
                                type: 'image',
                                icon: '&#xE40B;',
                                primary_head: 'Image',
                                second_head: 'Image without text'
                            },
                            {
                                type: 'button',
                                icon: '&#xE913;',
                                primary_head: 'Button',
                                second_head: 'Clickable URL button"'
                            },
                            {
                                type: 'imageTextLeft',
                                icon: 'format_textdirection_r_to_l',
                                primary_head: 'Image/Text',
                                second_head: 'Text on the left'
                            },
                            {
                                type: 'imageTextRight',
                                icon: 'format_textdirection_l_to_r',
                                primary_head: 'Image/Text',
                                second_head: 'Text on the right'
                            },
                            {
                                type: 'imageText2x2',
                                icon: 'text_fields',
                                primary_head: 'Image/Text',
                                second_head: '2 columns'
                            },
                            {
                                type: 'imageText3x2',
                                icon: 'wrap_text',
                                primary_head: 'Image/Text',
                                second_head: '3 columns'
                            },
                            {
                                type: 'video',
                                icon: 'video_library',
                                primary_head: 'Video',
                                second_head: 'Embed video source'
                            },
                            {
                                type: 'social',
                                icon: 'share',
                                primary_head: 'Social Icons',
                                second_head: '4 social icons'
                            },
                            {
                                type: 'unsubscribe',
                                icon: 'markunread_mailbox',
                                primary_head: 'Unscubscribe',
                                second_head: 'Block with unsubscription text'
                            }
                            ],
                            defaultOptions: {
                                'title': {
                                    type: 'title',
                                    options: {
                                        align: 'center',
                                        title: 'Enter your title here',
                                        subTitle: 'Subtitle',
                                        padding: ["30px", "15px", "30px", "15px"],
                                        backgroundColor: '#fff',
                                        font: {
                                            weight: 'normal',
                                            weightOptions: ['bold', 'bolder', 'lighter', 'inherit', 'initial', 'normal', 100, 200, 300, 400, 500, 600, 700, 800, 900],
                                            family: 'Arial, Helvetica, sans-serif',
                                            familyOptions: defaultFontFamily
                                        },
                                        color: '#444444'
                                    }
                                },
                                'divider': {
                                    type: 'divider',
                                    options: {
                                        padding: ['15px', '15px', '15px', '15px'],
                                        backgroundColor: '#ffffff',
                                        border: {
                                            size: 1,
                                            style: 'solid',
                                            styleOptions: ['solid', 'dashed', 'dotted'],
                                            color: '#DADFE1'
                                        }
                                    }
                                },
                                'text': {
                                    type: 'text',
                                    options: {
                                        padding: ['10px', '15px', '10px', '15px'],
                                        backgroundColor: '#ffffff',
                                        font: {
                                            family: 'inherit',
                                            familyOptions: defaultFontFamily
                                        },
                                        text: '<p style="margin: 0">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>'
                                    }
                                },
                                'html': {
                                    type: 'html',
                                    options: {
                                        html: '<p>Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>'
                                    }
                                },
                                'button': {
                                    type: 'button',
                                    options: {
                                        align: 'center',
                                        padding: ['12px', '20px', '12px', '20px'],
                                        margin: ['15px', '15px', '15px', '15px'],
                                        buttonText: 'Click me',
                                        url: '#',
                                        buttonBackgroundColor: '#3498DB',
                                        backgroundColor: '#ffffff',
                                        border: {
                                            size: 1,
                                            radius: 3,
                                            color: '#3498DB',
                                            style: 'solid',
                                            styleOptions: ['dotted', 'solid', 'dashed']
                                        },
                                        fullWidth: false,
                                        font: {
                                            size: 15,
                                            color: '#ffffff',
                                            weight: 'normal',
                                            weightOptions: ['bold', 'bolder', 'lighter', 'inherit', 'initial', 'normal', 100, 200, 300, 400, 500, 600, 700, 800, 900],
                                            family: 'inherit',
                                            familyOptions: defaultFontFamily
                                        }
                                    }
                                },
                                'image': {
                                    type: 'image',
                                    options: {
                                        align: 'center',
                                        padding: ["15px", "15px", "15px", "15px"],
                                        image: 'assets/350x150.jpg',
                                        width: '370',
                                        backgroundColor: '#ffffff',
                                        altTag: '',
                                        linkTo: {
                                            type: 'none',
                                            typeOptions: ['link', 'email', 'none'],
                                            link: ''
                                        }
                                    }
                                },
                                'video': {
                                    type: 'video',
                                    options: {
                                        padding: ["0px", "0px", "0px", "0px"],
                                        iframeVideo: '<iframe width="560" height="315" src="https://www.youtube.com/embed/cbk8mXPyCcc" frameborder="0" allowfullscreen></iframe>',
                                        fullWidth: true,
                                        backgroundColor: '#ffffff'
                                    }
                                },
                                'imageTextRight': {
                                    type: 'imageTextRight',
                                    options: {
                                        padding: ["15px", "15px", "15px", "15px"],
                                        image: 'assets/340x145.jpg',
                                        width: '340',
                                        backgroundColor: '#ffffff',
                                        altTag: '',
                                        linkTo: {
                                            type: 'none',
                                            typeOptions: ['link', 'email', 'none'],
                                            link: ''
                                        },
                                        text: '<p style="line-height: 20px;margin:0">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</p>'
                                    }
                                },
                                'imageTextLeft': {
                                    type: 'imageTextLeft',
                                    options: {
                                        padding: ["15px", "15px", "15px", "15px"],
                                        image: 'assets/340x145.jpg',
                                        width: '340',
                                        backgroundColor: '#ffffff',
                                        altTag: '',
                                        linkTo: {
                                            type: 'none',
                                            typeOptions: ['link', 'email', 'none'],
                                            link: ''
                                        },
                                        text: '<p style="line-height: 20px;margin:0"">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</p>'
                                    }
                                },
                                'imageText2x2': {
                                    type: 'imageText2x2',
                                    options: {
                                        padding: ["15px", "15px", "15px", "15px"],
                                        backgroundColor: '#ffffff',
                                        image1: 'assets/255x154.jpg',
                                        image2: 'assets/255x154.jpg',
                                        width1: '255',
                                        width2: '255',
                                        altTag1: '',
                                        altTag2: '',
                                        text1: '<p style="line-height: 20px;margin:0"">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</p>',
                                        text2: '<p style="line-height: 20px;margin:0"">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</p>',
                                        linkTo1: {
                                            type: 'none',
                                            typeOptions: ['link', 'email', 'none'],
                                            link: ''
                                        },
                                        linkTo2: {
                                            type: 'none',
                                            typeOptions: ['link', 'email', 'none'],
                                            link: ''
                                        }
                                    }
                                },
                                'imageText3x2': {
                                    type: 'imageText3x2',
                                    options: {
                                        padding: ["15px", "15px", "15px", "15px"],
                                        image1: 'assets/154x160.jpg',
                                        image2: 'assets/154x160.jpg',
                                        image3: 'assets/154x160.jpg',
                                        width1: '154',
                                        width2: '154',
                                        width3: '154',
                                        backgroundColor: '#ffffff',
                                        altTag1: '',
                                        altTag2: '',
                                        altTag3: '',
                                        linkTo1: {
                                            type: 'none',
                                            typeOptions: ['link', 'email', 'none'],
                                            link: ''
                                        },
                                        linkTo2: {
                                            type: 'none',
                                            typeOptions: ['link', 'email', 'none'],
                                            link: ''
                                        },
                                        linkTo3: {
                                            type: 'none',
                                            typeOptions: ['link', 'email', 'none'],
                                            link: ''
                                        },
                                        text1: '<p style="line-height: 20px;margin:0"">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>',
                                        text2: '<p style="line-height: 20px;margin:0"">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>',
                                        text3: '<p style="line-height: 20px;margin:0"">Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>'
                                    }
                                },
                                'unsubscribe': {
                                    type: 'unsubscribe',
                                    options: {
                                        padding: ['10px', '50px', '10px', '50px'],
                                        backgroundColor: '#eeeeee',
                                        font: {
                                            weight: 'normal',
                                            weightOptions: ['bold', 'bolder', 'lighter', 'inherit', 'initial', 'normal', 100, 200, 300, 400, 500, 600, 700, 800, 900],
                                            family: 'Arial, Helvetica, sans-serif',
                                            familyOptions: defaultFontFamily
                                        },
                                        text: '<p style="text-align: center; margin: 0px 0px 10px 0px; line-height: 1; font-size: 20px;" data-block-id="text-area"><span style="font-size: 8pt; color: #333333;">If you\'d like to unsubscribe and stop receiving these emails<span style="color: #0000ff;"> <a style="color: #0000ff;" href="#">click here</a></span>.</span></p>'
                                    }
                                },
                                'social': {
                                    type: 'social',
                                    options: {
                                        align: 'center',
                                        padding: ['10px', '15px', '10px', '15px'],
                                        backgroundColor: '#eeeeee',
                                        links: {
                                            facebook: {
                                                link: 'https://www.facebook.com/envato',
                                                active: true
                                            },
                                            twitter: {
                                                link: 'https://twitter.com/envatomarket',
                                                active: true
                                            },
                                            linkedin: {
                                                link: '',
                                                active: false
                                            },
                                            youtube: {
                                                link: 'https://www.youtube.com/user/Envato',
                                                active: true
                                            }
                                        }
                                    }
                                }
                            },
                            Email: data[1],
                            clonedEmail: JSON.parse(JSON.stringify(data[1]))
                        }
                    },
                    mounted: function () {
                        this.$root._data.loading = false;
                        utils.initTooltips();
                        this.Email = $.extend(true, {}, {
                            elements: this.Email.elements.map(element => this.clone(element)),
                            emailSettings: this.clone(this.Email.emailSettings)
                        }, this.Email)
                    },
                    watch: {
                        Email: {
                            handler: function () {
                                utils.initTooltips();
                            },
                            deep: true
                        },
                        preview: function (val, oldval) {
                            tinymce.editors.forEach(function (editor) {
                                return editor[val ? 'hide' : 'show']();
                            })
                        }
                    },
                    computed: {
                        loading: function () {
                            return this.$root._data.loading;
                        }
                    },
                    methods: {
                        hasChanges: function () {
                            return !utils.equals(this.Email, this.clonedEmail);
                        },
                        editElement: function (id) {
                            if (!id) {
                                return this.currentElement = {};
                            }
                            let self = this,
                                editElement = id !== 'emailSettings' ? self.Email.elements.find(function (element) {
                                    return element.id === id;
                                }) : self.Email[id];

                            if (self.preview || self.currentElement === editElement) return;
                            self.currentElement = {};
                            setTimeout(function () {
                                self.currentElement = editElement;
                            }, 10);
                        },
                        removeElement: function (remElement) {
                            let self = this;
                            return utils.confirm('Are you sure?', function () {
                                self.Email.elements = self.Email.elements.filter(function (element) {
                                    return element !== remElement;
                                });
                                if (utils.equals(self.currentElement, remElement)) {
                                    self.currentElement = {};
                                }
                            }, null, 'Delete element', 'Don\'t delete');

                        },
                        saveEmailTemplate: function () {
                            let self = this;
                            utils.createEmail(self.Email).then(function (res) {
                                if (res.errors.length) {
                                    return utils.notify(res.errors.map(function (err) {
                                        return err.message
                                    }).join('<br>')).error()
                                } else {
                                    self.Email.html = res.html;
                                    confs.storage.put(self.Email).then(function () {
                                        utils.notify('Email has been saved.').success();
                                        utils.trackEvent('Email', 'saved');
                                        self.clonedEmail = JSON.parse(JSON.stringify(self.Email));
                                        self.currentElement = {};
                                    });
                                }
                            }, function (err) {
                                return utils.notify(err).error()
                            })
                        },
                        addSocialNetwork: function (links, selectedNetwork) {
                            if (selectedNetwork) {
                                links[selectedNetwork].active = true
                            }
                        },
                        previewEmail: function () {
                            if (!this.Email.elements.length)
                                return utils.notify('Nothing to preview, please add some elements.').log();
                            this.preview = true;
                            this.currentElement = {};
                        },
                        exportEmail: function () {
                            if (!this.Email.elements.length)
                                return utils.notify('Nothing to export, please add some elements.').log();

                            const href = URL.createObjectURL(
                                new Blob([this.Email.html], { type: 'text/html' })
                            );

                            let a = document.createElement('a');
                            a.href = href;
                            a.target = '_blank';
                            a.download = utils.uid('export') + '.html';
                            document.body.appendChild(a);
                            a.click();
                            URL.revokeObjectURL(href);
                            document.body.removeChild(a);
                        },
                        cloneElement: function (element) {
                            let newEl = JSON.parse(JSON.stringify(element));
                            newEl.id = utils.uid();
                            this.Email.elements.splice(this.Email.elements.indexOf(element) + 1, 0, newEl);
                        },
                        clone: function (obj) {
                            let newElement = $.extend(true, {}, this.defaultOptions[obj.type]);
                            newElement.id = utils.uid();
                            newElement.component = obj.type + 'Template';
                            return newElement;
                        },
                        onMove: function () {
                            tinymce.editors.forEach(function (editor) {
                                return editor.hide();
                            })
                        },
                        onMoveEnd: function () {
                            tinymce.editors.forEach(function (editor) {
                                return editor.show();
                            })
                        },
                        importJson: function () {
                            let self = this;
                            let file = $('<input />', {
                                type: 'file',
                                name: 'import-file'
                            }).on('change', function () {
                                let importedFile = new FileReader();
                                importedFile.onload = function () {
                                    let importedData = JSON.parse(importedFile.result);
                                    if (utils.validateEmail(importedData)) {
                                        confs.storage.put(importedData).then(function () {
                                            self.currentElement = {};
                                            self.Email = $.extend(true, {}, importedData);
                                            self.clonedEmail = $.extend(true, {}, importedData);
                                            utils.notify('Email has been imported').success()
                                        });
                                    } else {
                                        utils.notify('Imported data isn\'t valid.').error()
                                    }
                                };
                                let fileToImport = this.files[0];
                                if (fileToImport.name.slice(-4) !== 'json') {
                                    return utils.notify('Invalid format file').log()
                                }
                                importedFile.readAsText(fileToImport)
                            });

                            if (!self.Email.elements.length)
                                return file.click();

                            return utils.confirm('On import all current details will be deleted!', function () {
                                return file.click()
                            }, function () {
                                return utils.notify('Import canceled').log()
                            }, 'accept', 'deny')
                        },
                        exportJson: function () {
                            const href = URL.createObjectURL(
                                new Blob([JSON.stringify(this.Email)], { type: 'application/json' })
                            );

                            let a = document.createElement('a');
                            a.target = '_blank';
                            a.href = href;
                            a.download = utils.uid('export') + '.json';
                            document.body.appendChild(a);
                            a.click();
                            URL.revokeObjectURL(href);
                            document.body.removeChild(a);
                        }
                    },
                    template: data[0],
                    directives: {
                        mdInput: {
                            bind: function (el, binding, vnode) {
                                let $elem = $(el);
                                let updateInput = function () {
                                    // clear wrapper classes
                                    $elem.closest('.md-input-wrapper').removeClass('md-input-wrapper-danger md-input-wrapper-success md-input-wrapper-disabled');

                                    if ($elem.hasClass('md-input-danger')) {
                                        $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-danger')
                                    }
                                    if ($elem.hasClass('md-input-success')) {
                                        $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-success')
                                    }
                                    if ($elem.prop('disabled')) {
                                        $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-disabled')
                                    }
                                    if ($elem.hasClass('label-fixed')) {
                                        $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                                    }
                                    if ($elem.val() != '') {
                                        $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                                    }
                                };

                                setTimeout(function () {
                                    if (!$elem.hasClass('md-input-processed')) {

                                        if ($elem.prev('label').length) {
                                            $elem.prev('label').addBack().wrapAll('<div class="md-input-wrapper"/>');
                                        } else {
                                            $elem.wrap('<div class="md-input-wrapper"/>');
                                        }
                                        $elem
                                            .addClass('md-input-processed')
                                            .closest('.md-input-wrapper')
                                            .append('<span class="md-input-bar"/>');
                                    }

                                    updateInput();

                                }, 100);

                                $elem
                                    .on('focus', function () {
                                        $elem.closest('.md-input-wrapper').addClass('md-input-focus')
                                    })
                                    .on('blur', function () {
                                        setTimeout(function () {
                                            $elem.closest('.md-input-wrapper').removeClass('md-input-focus');
                                            if ($elem.val() == '') {
                                                $elem.closest('.md-input-wrapper').removeClass('md-input-filled')
                                            } else {
                                                $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                                            }
                                        }, 100)
                                    });
                            }
                        },
                        inputFileUpload: {
                            twoWay: true,
                            bind: function (elem, binding, vnode) {

                                let uploadLink = $(elem).find('.upload-image a');
                                let uploadingIcon = $(elem).find('.uploading')

                                if (/uploads.im/.test(confs.options.urlToUploadImage) && location.protocol === 'https:') {
                                    console.error('Sorry, but uploads.im don\'t support https!');
                                    return;
                                }

                                setTimeout(function () {

                                    let uploadInput = $('<input/>', {
                                        type: 'file',
                                        name: 'file'
                                    }).bind('change', function (event) {

                                        if (!confs.options.urlToUploadImage)
                                            throw Error('You don\'t set the \'urlToUploadImage\' in variables.');

                                        let inputFile = $(event.target)
                                        inputFile.prop('disabled', true);
                                        uploadLink.text('Uploading');
                                        uploadingIcon.addClass('active');
                                        let formData = new FormData();
                                        formData.append('upload', event.target.files[0]);
                                        return $.ajax({
                                            url: confs.options.urlToUploadImage,
                                            data: formData,
                                            processData: false,
                                            contentType: false,
                                            type: 'POST',
                                            success: function (res) {
                                                if (res.status_code == 200) {
                                                    let customEvent = new Event('input', {
                                                        bubbles: true
                                                    }); // won't work in IE <11
                                                    $(elem).find('input.image-path').val(res.data.img_url);
                                                    $(elem).find('input.image-path').get(0).dispatchEvent(customEvent);
                                                    utils.notify('Your image has been uploaded').log()
                                                } else {
                                                    utils.notify(res.status_txt).error()
                                                }
                                            },
                                            error: function (err) {
                                                utils.notify(err.statusText).error()
                                            },
                                            complete: function () {
                                                inputFile.prop('disabled', false);
                                                uploadLink.text('Browse');
                                                uploadingIcon.removeClass('active');
                                            }
                                        });
                                    })

                                    uploadLink.on('click', (e) => {
                                        e.preventDefault();

                                        if (/uploads.im/.test(confs.options.urlToUploadImage) && location.protocol == 'https:') {
                                            return utils.notify('Sorry, but uploads.im don\'t support https!').error();
                                        } else {
                                            return uploadInput.click();
                                        }
                                    })
                                }, 100);

                            },
                            unbind: function (elem) {
                                $(elem).unbind('change');
                            }
                        }
                    },
                    filters: {
                        makeTitle: function (value) {
                            if (!value) return '';
                            value = utils.camelToSnake(value);
                            value = value.charAt(0).toUpperCase() + value.slice(1);
                            return value.replace(/_/g, ' ');
                        }
                    },
                    components: {
                        colorPicker: {
                            props: ['color'],
                            template: `
                                <div class="color-input-container">
                                    <div class="current-color" color-picker @click="openColorPicker" :style="{ backgroundColor: color }"></div>
                                    <input id="elementBackgroundColor" type="text" @input="update()" v-model="color" />
                                    <input type="color" ref="inputColor" @input="update()" style="display: none; visibility: hidden" v-model="color" />
                                </div>
                            `,
                            methods: {
                                update() {
                                    this.$emit('update:color', this.color)
                                },
                                openColorPicker() {
                                    $(this.$refs.inputColor).trigger('click')
                                }
                            }
                        },
                        titleTemplate: {
                            props: ['element'],
                            template: '<table class="main" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" :style="{ backgroundColor: element.options.backgroundColor }" style="display: table;" data-type="title"> <tbody> <tr>     <td :align="element.options.align" :style="{paddingTop: this.element.options.padding[0], paddingRight: this.element.options.padding[1], paddingBottom: this.element.options.padding[2], paddingLeft: this.element.options.padding[3]}" class="title" style="color: #757575;" data-block-id="background">         <h1 :style="{fontFamily: element.options.font.family, fontWeight: element.options.font.weight, margin: 0,color: element.options.color }" v-if="element.options.title.length" data-block-id="main-title">{{  element.options.title  }}</h1>         <h4 :style="{fontFamily: element.options.font.family, fontWeight: element.options.font.weight, margin: 0,color: element.options.color }" v-if="element.options.subTitle.length" data-block-id="sub-title">{{  element.options.subTitle  }}</h4>     </td> </tr> </tbody>\n</table>'
                        },
                        buttonTemplate: {
                            props: ['element'],
                            template: '<table class="main" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF" align="center" :style="{backgroundColor: element.options.backgroundColor}" style="display: table;" data-type="button"> <tbody> <tr>     <td class="buttons-full-width">         <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" :style="{ textAlign: element.options.align }" class="button">             <tbody>             <tr>                 <td class="button" :style="{paddingTop: this.element.options.margin[0], paddingRight: this.element.options.margin[1], paddingBottom: this.element.options.margin[2], paddingLeft: this.element.options.margin[3]}"">                     <a :style="{backgroundColor: element.options.buttonBackgroundColor, color: element.options.font.color, fontFamily: element.options.font.family, fontSize: element.options.font.size + \'px\', lineHeight: \'19px\', display: element.options.fullWidth ? \'block\' : \'inline-block\', borderRadius: element.options.border.radius + \'px\', border: `${element.options.border.size}px ${element.options.border.style}  ${element.options.border.color}`, textAlign: \'center\', textDecoration: \'none\', fontWeight: element.options.font.weight,margin: 0, width: \'auto\', paddingTop: this.element.options.padding[0], paddingRight: this.element.options.padding[1], paddingBottom: this.element.options.padding[2], paddingLeft: this.element.options.padding[3]}" class="button-1" :href="element.options.url" data-default="1">{{ element.options.buttonText }}</a>                   <!--[if mso]>             </center>           </v:roundrect>         <![endif]-->                 </td>             </tr>             </tbody>         </table>     </td> </tr> </tbody>\n</table>'
                        },
                        textTemplate: {
                            props: ['element'],
                            template: '<table width="600" class="main" cellspacing="0" cellpadding="0" border="0" :style="{backgroundColor: element.options.backgroundColor}" style="display: table;" align="center" data-type="text-block">    <tbody>    <tr>        <td class="block-text" data-block-id="background" align="left" :style="{paddingTop: this.element.options.padding[0], paddingRight: this.element.options.padding[1], paddingBottom: this.element.options.padding[2], paddingLeft: this.element.options.padding[3], fontFamily: this.element.options.font.family}" style="font-size: 13px; color: #000000; line-height: 22px;">  <tinymce v-model="element.options.text"></tinymce> </td>   </tr>    </tbody></table>'
                        },
                        htmlTemplate: {
                            props: ['element'],
                            template: '<table width="600" class="main" cellspacing="0" cellpadding="0" border="0" align="center" data-type="html-block">    <tbody>    <tr>        <td class="block-text" data-block-id="background" align="left" v-html="element.options.html"> </td>    </tr>    </tbody></table>'
                        },
                        socialTemplate: {
                            props: ['element'],
                            template: '<table class="main" align="center" width="600" cellspacing="0" cellpadding="0" border="0" :style="{backgroundColor: this.element.options.backgroundColor}" style="display: table;" data-type="social-links"> <tbody> <tr>     <td class="social" :align="this.element.options.align" :style="{paddingTop: this.element.options.padding[0], paddingRight: this.element.options.padding[1], paddingBottom: this.element.options.padding[2], paddingLeft: this.element.options.padding[3]}">         <a :href="element.options.links.facebook.link"  v-if="element.options.links.facebook.active" target="_blank" style="border: none;text-decoration: none;" class="facebook">             <img border="0" src="' + location.origin + '/assets/social/facebook.png">         </a>         <a :href="element.options.links.twitter.link"  v-if="element.options.links.twitter.active" target="_blank" style="border: none;text-decoration: none;" class="twitter">             <img border="0"  src="' + location.origin + '/assets/social/twitter.png">         </a>         <a :href="element.options.links.linkedin.link"  v-if="element.options.links.linkedin.active" target="_blank" style="border: none;text-decoration: none;" class="linkedin">             <img border="0" src="' + location.origin + '/assets/social/linkedin.png">         </a>         <a :href="element.options.links.youtube.link"  v-if="element.options.links.youtube.active" target="_blank" style="border: none;text-decoration: none;" class="youtube">             <img border="0" src="' + location.origin + '/assets/social/youtube.png">         </a>     </td> </tr> </tbody>\n</table>'
                        },
                        unsubscribeTemplate: {
                            props: ['element'],
                            template: '<table width="600" class="main" cellspacing="0" cellpadding="0" border="0" :style="{backgroundColor: element.options.backgroundColor}" style="display: table;" align="center" data-type="text-block">    <tbody>    <tr>        <td data-block-id="background" align="left" :style="{paddingTop: this.element.options.padding[0], paddingRight: this.element.options.padding[1], paddingBottom: this.element.options.padding[2], paddingLeft: this.element.options.padding[3], fontFamily: element.options.font.family, fontWeight: element.options.font.weight, margin: 0,color: element.options.color }" style="font-family: Arial,serif; font-size: 13px; color: #000000; line-height: 22px;"><tinymce v-model="element.options.text"></tinymce></td></tr>    </tbody></table>'
                        },
                        dividerTemplate: {
                            props: ['element'],
                            template: '<table class="main" width="100%" style="border: 0; display: table;" :style="{backgroundColor: element.options.backgroundColor}" cellspacing="0" cellpadding="0" border="0" align="center" data-type="divider"> <tbody> <tr>     <td class="divider-simple" :style="{paddingTop: this.element.options.padding[0], paddingRight: this.element.options.padding[1], paddingBottom: this.element.options.padding[2], paddingLeft: this.element.options.padding[3]}">         <table width="100%" cellspacing="0" cellpadding="0" border="0" :style="{borderTop: `${element.options.border.size}px ${element.options.border.style} ${element.options.border.color}`}">             <tbody>             <tr>                 <td width="100%"></td>             </tr>             </tbody>         </table>     </td> </tr> </tbody>\n</table>'
                        },
                        imageTemplate: {
                            props: ['element'],
                            template: '<table width="600" class="main"  cellspacing="0" cellpadding="0" border="0" align="center" :style="{backgroundColor: element.options.backgroundColor}" style="display: table;" data-type="image">    <tbody>    <tr>        <td :align="element.options.align" :style="{paddingTop: this.element.options.padding[0], paddingRight: this.element.options.padding[1], paddingBottom: this.element.options.padding[2], paddingLeft: this.element.options.padding[3]}" class="image"><img border="0" style="display:block;max-width:100%;" :style="{width: element.options.width}" :src="element.options.image" tabindex="0">        </td>    </tr>    </tbody></table>'
                        },
                        imageTextRightTemplate: {
                            props: ['element'],
                            template: `<table class="main" width="100%" cellspacing="0" cellpadding="0" border="0" :bgcolor="element.options.backgroundColor" align="center">
                                <tbody>
                                <tr :style="{paddingTop: this.element.options.padding[0], paddingRight: this.element.options.padding[1], paddingBottom: this.element.options.padding[2], paddingLeft: this.element.options.padding[3]}" style="display: table-cell; font-family: Arial; font-size: 13px; color: #000000; line-height: 20px;">
                                    <td width="295">
                                        <img border="0" align="left" :src="element.options.image" :width="element.options.width" style="display: block;margin: 0px;max-width: 340px;padding:5px 5px 0 0;">
                                    </td>
                                    <td width="10"></td>
                                    <td width="295" valign="top"><tinymce v-model="element.options.text"></tinymce></td>
                                </tr>
                                </tbody>
                            </table>`
                        },
                        imageTextLeftTemplate: {
                            props: ['element'],
                            template: `<table class="main" width="100%" cellspacing="0" cellpadding="0" border="0" :bgcolor="element.options.backgroundColor" align="center">
                                <tbody>
                                <tr :style="{paddingTop: this.element.options.padding[0], paddingRight: this.element.options.padding[1], paddingBottom: this.element.options.padding[2], paddingLeft: this.element.options.padding[3]}" style="display: table-cell; font-family: Arial; font-size: 13px; color: #000000; line-height: 20px;">
                                    <td class="text-block" valign="top"><tinymce v-model="element.options.text"></tinymce></td>
                                    <td width="10px"></td>
                                    <td width="295">
                                        <img border="0" align="left" :src="element.options.image" :width="element.options.width" style="display: block;margin: 0px;max-width: 340px;padding:5px 5px 0 0;">
                                    </td>
                                </tr>
                                </tbody>
                            </table>`
                        },
                        imageText2x2Template: {
                            props: ['element'],
                            template: `<table class="main" width="100%" cellspacing="0" cellpadding="0" border="0" :bgcolor="element.options.backgroundColor" align="center" data-type="imageText2x2Template"> <tbody style="display: table-cell;" :style="{paddingTop: this.element.options.padding[0], paddingRight: this.element.options.padding[1], paddingBottom: this.element.options.padding[2], paddingLeft: this.element.options.padding[3]}"> <tr>     <td width="295" style="padding-left: 5px;">      <img :src="element.options.image1" :width="element.options.width1" :alt="element.options.altTag1" style="max-width: 100%" border="0">     </td>     <td width="10"></td>     <td width="295" style="padding-right: 5px;">      <img :src="element.options.image2" :width="element.options.width2" :alt="element.options.altTag2" style="max-width: 100%" border="0">     </td> </tr> <tr>     <td width="295" align="left" style="font-family: Arial;font-size: 13px;color: #000000;line-height: 20px;padding-left: 5px;"><tinymce v-model="element.options.text1"></tinymce></td>                                  <td width="10"></td>     <td width="295" align="left" style="font-family: Arial;font-size: 13px;color: #000000;line-height: 20px;padding-right: 5px;"><tinymce v-model="element.options.text2"></tinymce></td>                               </tr> </tbody>  </table>`
                        },
                        imageText3x2Template: {
                            props: ['element'],
                            template: `<table width="100%" class="main" cellspacing="0" cellpadding="0" border="0" :bgcolor="element.options.backgroundColor" align="center" data-type="imageText3x2">
                                <tbody>
                                <tr>
                                    <td valign="top" width="100%">
                                    <div style="display: flex" :style="{paddingTop: this.element.options.padding[0], paddingRight: this.element.options.padding[1], paddingBottom: this.element.options.padding[2], paddingLeft: this.element.options.padding[3]}">
                                        <div style="flex: 1 1 100%; display: flex; flex-direction: column;padding: 0 3px;">
                                        <img style="max-width: 100%; padding-bottom: 3px;display: block;margin: 0 auto;" :src="element.options.image1" :width="element.options.width1" :alt="element.options.altTag1" border="0">
                                        <div style="font-family: Arial, serif; font-size: 13px; color: #000000; line-height: 20px"><tinymce  v-model="element.options.text1"></tinymce></div>
                                        </div>
                                        <div style="flex: 1 1 100%; display: flex; flex-direction: column;padding: 0 3px;">
                                        <img style="max-width: 100%; padding-bottom: 3px;display: block;margin: 0 auto;" :src="element.options.image2" :width="element.options.width2" :alt="element.options.altTag2" border="0">
                                        <div style="font-family: Arial, serif; font-size: 13px; color: #000000; line-height: 20px"><tinymce v-model="element.options.text2"></tinymce></div>
                                        </div>
                                        <div style="flex: 1 1 100%; display: flex; flex-direction: column;padding: 0 3px;">
                                        <img style="max-width: 100%; padding-bottom: 3px;display: block;margin: 0 auto;" :src="element.options.image3" :width="element.options.width3" :alt="element.options.altTag3" border="0">
                                        <div style="font-family: Arial, serif; font-size: 13px; color: #000000; line-height: 20px"><tinymce v-model="element.options.text3"></tinymce></div>
                                        </div>
                                    </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>`
                        },
                        videoTemplate: {
                            props: ['element'],
                            computed: {
                                iframeCode: function () {
                                    let iframe = $(this.element.options.iframeVideo),
                                        currentWidth = $(this.element.options.iframeVideo).attr('width');

                                    return iframe.attr('width', this.element.options.fullWidth ? 600 : currentWidth).get(0).outerHTML
                                }
                            },
                            template: '<table width="600" class="main"  cellspacing="0" cellpadding="0" border="0" align="center" :style="{backgroundColor: element.options.backgroundColor}" style="display: table;" data-type="image">    <tbody>    <tr>        <td :style="{paddingTop: this.element.options.padding[0], paddingRight: this.element.options.padding[1], paddingBottom: this.element.options.padding[2], paddingLeft: this.element.options.padding[3], lineHeight: 0}" class="video" :class="{fullWidth: element.options.fullWidth}" v-html="iframeCode"></td>    </tr>    </tbody></table>'
                        }
                    }
                })
            }, reject)
        },
        'loading': {
            template: '<transition name="fade"><h1 class="loading" v-if="loading">Loading ...</h1></transition>',
            computed: {
                loading: function () {
                    return this.$root._data.loading;
                }
            }
        }
    }
}).$mount('#app');

Vue.directive('tinymceEditor', {
    twoWay: true,
    bind: function (elem, binding, obj) {
        let self = elem,
            textarea = [];
        tinymce.baseURL = 'bower_components/tinymce';
        setTimeout(function () {
            tinymce.init({
                target: self,
                inline: true,
                skin: 'lightgray',
                theme: 'modern',
                plugins: ["advlist autolink lists link image charmap", "searchreplace visualblocks code fullscreen", "insertdatetime media table contextmenu paste", 'textcolor'],
                toolbar: "undo redo | styleselect | bold italic fontsizeselect forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | link image",
                fontsize_formats: '8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 18pt 24pt 36pt',
                setup: function (editor) {
                    // init tinymce
                    editor.on('init', function () {
                        textarea = $(elem).next('textarea');
                        editor.setContent(binding.value);
                    });

                    // when typing keyup event
                    editor.on('keyup change', function () {
                        // get new value
                        textarea.val(editor.getContent({
                            format: 'raw'
                        }));
                        let customEvent = new Event('input', {
                            bubbles: true
                        }); // won't work in IE <11
                        textarea.get(0).dispatchEvent(customEvent);
                    });
                }
            });
        }, 0)
    },
    update: function (el, obj) {
        let currentEditor = tinymce.get($(el).attr('id'));
        if (obj.modifiers.update) {
            currentEditor.setContent(obj.value)
        }
    },
    unbind: function (el) {
        tinymce.get($(el).attr('id')).destroy()
    }
})

Vue.component('tinymce', {
    template: '<content ref="editor"><div v-html="value"></div></content>',
    name: 'tiny-mce',
    props: ['value'],
    mounted() {
        tinymce.baseURL = 'bower_components/tinymce';
        tinymce.init({
            target: this.$refs.editor,
            inline: true,
            skin: 'lightgray',
            theme: 'modern',
            plugins: ["advlist autolink lists link image charmap", "searchreplace visualblocks code fullscreen", "insertdatetime media table contextmenu paste", 'textcolor'],
            toolbar: "undo redo | styleselect | bold italic fontsizeselect forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | link image",
            fontsize_formats: '8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 18pt 24pt 36pt',
            init_instance_callback: (editor) => {
                editor.on('keyup change', (e) => {
                    this.$emit('input', editor.getContent({
                        format: 'raw'
                    }))
                });
            }
        })
    },
    destroyed() {
        tinymce.get(this.$refs.editor.id).destroy();
    }
})

// Prevent jQuery UI dialog from blocking focusin
$(document).on('focusin', function (e) {
    if ($(e.target).closest(".mce-window, .moxman-window").length) {
        e.stopImmediatePropagation();
    }
});