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

export default class MegaMenu {
    constructor(menu, options) {
        // Settings
        // this.settings = Object.assign(defaults, settings);
        // May still need babel specific polyfill? Can throw away that file if
        // browsers one day universally accept this instead of having to rewrite
        this.options = { ...defaultOptions, ...options };
        this.megamenu = menu;
        this.megamenuItems = [...menu.querySelectorAll('[data-megamenu-item]')];

        // Apply default aria attributes
        this.initARIA();

        // For each primary nam item trigger attach listeners
        this.megamenuItems.forEach(item => {
            const trigger = item.querySelector('[data-megamenu-trigger]');
            trigger.addEventListener('click', this.handleClick);
            trigger.addEventListener('focusin', this.handleFocusIn);
            trigger.addEventListener('focusout', this.handleFocusOut);
        });

        // Attach keydown listened to whole megamenu
        this.megamenu.addEventListener('keydown', this.handleKeydown);
    }

    // Keyboard
    // left/right keys
    // Multi columns/panels

    initARIA = () => {
        this.megamenuItems.forEach(item => {
            const trigger = item.querySelector('[data-megamenu-trigger]');
            const panel = item.querySelector('[data-megamenu-panel]');
            const uniqueID = shortID();
            const controlID = `${this.options.menuClass}-control-${uniqueID}`;
            const labelID = `${this.options.menuClass}-label-${uniqueID}`;

            const triggerAttributes = {
                'aria-haspopup': true,
                'aria-controls': controlID,
                id: labelID,
                'aria-expanded': false,
            };

            const panelAttributes = {
                'aria-labelledby': labelID,
                'aria-hidden': true,
                id: controlID,
            };

            setAttributes(trigger, triggerAttributes);
            setAttributes(panel, panelAttributes);
        });
    };

    handleClick = e => {
        // Test that the target has a panel to activate before preventing default
        e.preventDefault();
        // Test if there is a panel open already?
        // Test if target is inside megamenu? if not, run handleClickOutside
    };

    handleClickOutside = e => {
        console.log('handle click outside');
        // Run toggle with closing params
    };

    handleFocus = event => {
        const focusTarget = event.target;
        focusTarget.classList.add(
            `${this.options.menuItemTrigger}${this.options.focusedModifier}`,
        );
    };

    handleFocusIn = event => {
        const focusTarget = event.target;
        focusTarget.classList.add(
            `${this.options.menuItemTrigger}${this.options.focusedModifier}`,
        );
    };

    handleFocusOut = event => {
        const focusTarget = event.target;
        focusTarget.classList.remove(
            `${this.options.menuItemTrigger}${this.options.focusedModifier}`,
        );
    };

    handleKeydown = event => {
        const keyCode = event.keyCode;
        const isPrimaryNav = event.target.classList.contains(
            this.options.menuItemTrigger,
        );

        switch (keyCode) {
            case Keyboard.ESCAPE:
                console.log('Escape');
                break;
            case Keyboard.DOWN:
                console.log('Down');
                break;
            case Keyboard.UP:
                console.log('Up');
                break;
            case Keyboard.RIGHT:
                if (isPrimaryNav) {
                    const navItem = event.target.parentElement;
                    const hasNextItem = navItem.nextElementSibling;
                    if (hasNextItem) {
                        navItem.nextElementSibling
                            .querySelector('[data-megamenu-trigger]')
                            .focus();
                    }
                }
                break;
            case Keyboard.LEFT:
                if (isPrimaryNav) {
                    const navItem = event.target.parentElement;
                    const hasNextItem = navItem.previousElementSibling;
                    if (hasNextItem) {
                        navItem.previousElementSibling
                            .querySelector('[data-megamenu-trigger]')
                            .focus();
                    }
                }
                break;
            case Keyboard.TAB:
                console.log('Tab');
                break;
            case Keyboard.SPACE:
                console.log('Space');
                break;
            case Keyboard.ENTER:
                console.log('Enter');
                break;
            default:
                //  console.log('Another random key');
                // Search string stuff
                break;
        }
    };

    showPanel = () => {
        console.log('show panel');
    };

    hidePanel = () => {
        console.log('hide panel');
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

    togglePanel = () => {
        console.log('toggle');
    };
}

export const initAll = options => {
    const menus = [...document.querySelectorAll('[data-megamenu]')];
    menus.forEach(menu => new MegaMenu(menu, options));
};
