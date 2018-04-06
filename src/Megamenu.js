import './Megamenu.css';

const Keyboard = {
    BACKSPACE: 8,
    COMMA: 188,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    LEFT: 37,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    RIGHT: 39,
    SPACE: 32,
    TAB: 9,
    UP: 38,
};

const defaultOptions = {
    /*  
        Default css class used to define the megamenu styling but
        will also be used for unique ID's which are required to 
        indicate aria-owns, aria-controls and aria-labelledby 
    */
    menuClass: 'megamenu',
    menuItem: 'megamenu__item',
    menuItemTrigger: 'megamenu__item-trigger',
    panelClass: 'megamenu__panel',
    panelNavGroupClass: 'megamenu__panel-group',
    activeModifier: '--active',
    focusedModifier: '--focused',
    hoverModifier: '--hover',
    hover: false,
    openDelay: 0,
    closeDelay: 250,
};

function setAttributes(el, attrs) {
    Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));
}

function shortID() {
    return `0000${((Math.random() * 36 ** 4) << 0).toString(36)}`.slice(-4);
}

function isChild(el, parent) {
    if (parent.contains(el) || parent === el) {
        return true;
    }

    return false;
}

export default class MegaMenu {
    constructor(menu, options) {
        // Settings
        // this.settings = Object.assign(defaults, settings);
        // May still need babel specific polyfill? Can throw away that file if
        // browsers one day universally accept this instead of having to rewrite
        this.options = { ...defaultOptions, ...options };
        this.megamenu = menu;
        this.megamenuItems = [...menu.querySelectorAll('[data-megamenu-item]')];
        this.opened = false;

        // Apply default aria attributes
        this.initARIA();

        // For each primary nam item trigger attach listeners
        this.megamenuItems.forEach(item => {
            const itemLink = item.querySelector('a');

            if (itemLink) {
                itemLink.addEventListener('click', this.handleClick);
                itemLink.addEventListener('focusin', this.handleFocusIn);
                itemLink.addEventListener('focusout', this.handleFocusOut);
            }
        });

        // Attach keydown listened to whole megamenu
        this.megamenu.addEventListener('keydown', this.handleKeydown);
    }

    initARIA = () => {
        setAttributes(this.megamenu, { role: 'menubar' });

        this.megamenuItems.forEach(item => {
            const trigger = item.querySelector('a');
            const triggerLabel = trigger.text;
            const hasPanel = trigger.hasAttribute('data-megamenu-trigger');
            const panel = item.querySelector('[data-megamenu-panel]');
            const uniqueID = shortID();
            const controlID = `${this.options.menuClass}-control-${uniqueID}`;
            const labelID = `${this.options.menuClass}-label-${uniqueID}`;

            setAttributes(trigger, { role: 'menuitem' });

            if (hasPanel) {
                const triggerAttributes = {
                    'aria-haspopup': true,
                    'aria-controls': controlID,
                    id: labelID,
                    'aria-expanded': false,
                };

                const panelAttributes = {
                    'aria-labelledby': labelID,
                    'aria-hidden': true,
                    'aria-label': triggerLabel,
                    id: controlID,
                    role: 'menu',
                };

                setAttributes(trigger, triggerAttributes);
                setAttributes(panel, panelAttributes);
            }
        });
    };

    handleClick = e => {
        const panelID = e.target.getAttribute('aria-controls');
        // Test that the target has a panel to activate before preventing default
        if (panelID) {
            e.preventDefault();
            const panel = document.getElementById(panelID);
            this.togglePanel(panel);
        }
    };

    handleClickOutside = e => {
        if (!isChild(e.target, this.megamenu)) {
            this.hidePanel();
        }
    };

    handleFocus = e => {
        // const focusTarget = event.target;
        // focusTarget.classList.add(
        //     `${this.options.menuItemTrigger}${this.options.focusedModifier}`,
        // );
    };

    handleFocusIn = e => {
        const focusTarget = e.target;
        focusTarget.classList.add(
            `${this.options.menuItemTrigger}${this.options.focusedModifier}`,
        );
    };

    handleFocusOut = e => {
        const focusTarget = e.target;
        focusTarget.classList.remove(
            `${this.options.menuItemTrigger}${this.options.focusedModifier}`,
        );
    };

    handleNextKey = el => {
        const nextLink = el.querySelector('a');
        const nextLinkControl = nextLink.getAttribute('aria-controls');
        if (this.opened) {
            if (nextLinkControl) {
                this.showPanel(document.getElementById(nextLinkControl));
            } else {
                this.hidePanel();
            }
        }
        nextLink.focus();
    };

    handleKeydown = e => {
        const keyCode = e.keyCode;
        const target = e.target;
        const targetParent = target.parentElement;
        const targetIsMegamenuChild = isChild(target, this.megamenu);
        const targetIsTopnavLink =
            target.hasAttribute('role') &&
            target.getAttribute('role') === 'menuitem';
        const targetIsPanelTrigger = target.hasAttribute('aria-controls');
        const panelID = target.getAttribute('aria-controls');
        const panel = panelID && document.getElementById(panelID);

        const previousItem = targetParent.previousElementSibling;
        let previousLink;
        const nextItem = targetParent.nextElementSibling;
        let nextLink;

        if (!targetIsMegamenuChild) {
            return;
        }

        switch (keyCode) {
            case Keyboard.ESCAPE:
                if (this.opened) {
                    this.hidePanel();
                }
                break;
            case Keyboard.DOWN:
                if (targetIsTopnavLink) {
                    if (targetIsPanelTrigger) {
                        const firstLink = panel.querySelector('a');
                        this.showPanel(panel);
                        firstLink.focus();
                    }
                } else {
                    if (nextItem) {
                        nextLink = nextItem.querySelector('a');
                        nextLink.focus();
                    } else {
                        // Reached the end of links inside panel
                        const closestNextItem = target.closest(
                            '[data-megamenu-item]',
                        ).nextElementSibling;

                        if (!closestNextItem) {
                            return;
                        }
                        const closestNextLink = closestNextItem.querySelector(
                            'a',
                        );
                        const nextPanelID = closestNextLink.getAttribute(
                            'aria-controls',
                        );
                        if (nextPanelID) {
                            const nextPanel = document.getElementById(
                                nextPanelID,
                            );
                            this.showPanel(nextPanel);
                        } else if (this.opened) {
                            this.hidePanel();
                        }
                        closestNextLink.focus();
                    }
                }
                break;
            case Keyboard.UP:
                if (targetIsTopnavLink) {
                    if (!this.opened) {
                        return;
                    }

                    if (previousItem) {
                        previousLink = previousItem.querySelector('a');

                        // show next panel if next link is a controller
                        if (previousLink.hasAttribute('aria-controls')) {
                            const previousPanelID = previousLink.getAttribute(
                                'aria-controls',
                            );
                            const previousPanel = document.getElementById(
                                previousPanelID,
                            );
                            const allPanelLinks = previousPanel.querySelectorAll(
                                'a',
                            );
                            this.showPanel(previousPanel);
                            allPanelLinks[allPanelLinks.length - 1].focus();
                        }
                    } else {
                        this.hidePanel();
                    }
                } else {
                    if (previousItem) {
                        // has a sibling to go up to
                        previousLink = previousItem.querySelector('a');
                        previousLink.focus();
                    } else {
                        // Hit the first link in panel go up to topnav link
                        const closestNextLink = target
                            .closest('[data-megamenu-item]')
                            .querySelector('a');

                        closestNextLink.focus();
                    }
                }
                break;
            case Keyboard.RIGHT:
                if (nextItem) {
                    this.handleNextKey(nextItem);
                }
                break;
            case Keyboard.LEFT:
                if (previousItem) {
                    this.handleNextKey(previousItem);
                }
                break;
            case Keyboard.TAB:
                break;
            case Keyboard.SPACE:
                break;
            case Keyboard.ENTER:
                break;
            default:
                //  console.log('Another random key');
                // Search string stuff
                break;
        }
    };

    resetPanels = () => {
        const allPanels = this.megamenu.querySelectorAll(
            '[data-megamenu-panel]',
        );
        const allTriggers = this.megamenu.querySelectorAll(
            '[data-megamenu-trigger]',
        );
        // Reset any active attribute on panel triggers
        allTriggers.forEach(t => {
            t.setAttribute('aria-expanded', false);
            t.classList.remove(
                `${this.options.menuItemTrigger}${this.options.activeModifier}`,
            );
        });
        // Close any active panels
        allPanels.forEach(p => {
            p.setAttribute('aria-hidden', true);
            p.classList.remove(
                `${this.options.panelClass}${this.options.activeModifier}`,
            );
        });
    };

    showPanel = panel => {
        this.resetPanels();
        this.megamenu.classList.add(
            `${this.options.menuClass}${this.options.activeModifier}`,
        );
        const triggerID = panel.getAttribute('aria-labelledby');
        const trigger = document.getElementById(triggerID);
        // Add active state to panel trigger
        trigger.setAttribute('aria-expanded', true);
        trigger.classList.add(
            `${this.options.menuItemTrigger}${this.options.activeModifier}`,
        );
        // Add active state to current panel
        panel.setAttribute('aria-hidden', false);
        panel.classList.add(
            `${this.options.panelClass}${this.options.activeModifier}`,
        );
        document.addEventListener('click', this.handleClickOutside);
        this.opened = true;
    };

    hidePanel = () => {
        this.resetPanels();
        this.megamenu.classList.remove(
            `${this.options.menuClass}${this.options.activeModifier}`,
        );
        document.removeEventListener('click', this.handleClickOutside);
        this.opened = false;
    };

    toggleTabIndex = (isActive, menuItemLinks) => {
        menuItemLinks.forEach(link => {
            if (isActive) {
                link.setAttribute('tabindex', -1);
            } else {
                link.setAttribute('tabindex', 0);
            }
        });
    };

    togglePanel = panel => {
        const isActive = panel.getAttribute('aria-hidden');
        if (isActive === 'true') {
            this.showPanel(panel);
        } else if (isActive === 'false') {
            this.hidePanel(panel);
        }
    };
}

export const initAll = options => {
    const menus = [...document.querySelectorAll('[data-megamenu]')];
    menus.forEach(menu => new MegaMenu(menu, options));
};
