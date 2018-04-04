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

    // Keyboard
    // left/right keys
    // Multi columns/panels

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

        switch (keyCode) {
            case Keyboard.ESCAPE:
                break;
            case Keyboard.DOWN:
                if (target.hasAttribute('aria-controls')) {
                    const panelID = target.getAttribute('aria-controls');
                    const panel = document.getElementById(panelID);
                    const firstLink = panel.querySelector('a');

                    if (
                        panel.classList.contains(
                            `${this.options.panelClass}${
                                this.options.activeModifier
                            }`,
                        )
                    ) {
                    } else {
                        this.showPanel(panel);
                        firstLink.focus();
                    }
                }
                break;
            case Keyboard.UP:
                break;
            case Keyboard.RIGHT:
                const nextItem = targetParent.nextElementSibling;
                if (nextItem) {
                    this.handleNextKey(nextItem);
                }
                break;
            case Keyboard.LEFT:
                const previousItem = targetParent.previousElementSibling;
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
