import React from 'react';
import logo from './logo.svg';

const App = () => {
    return (
        <div className="page">
            <div className="page__header">
                <div className="megamenu" data-megamenu>
                    {/* <div className="megamenu__item" data-megamenu-item>
                        <a href="" className="page__logo">
                            <img src={logo} alt="Logo" />
                        </a>
                    </div> */}
                    <div className="megamenu__item" data-megamenu-item>
                        <a
                            href=""
                            className="megamenu__item-trigger"
                            data-megamenu-trigger
                        >
                            Item one
                            <span className="megamenu__trigger-arrow"></span>
                        </a>
                        <div className="megamenu__panel" data-megamenu-panel>
                            <ul>
                                <li>
                                    <a href="" className="megamenu__link">Panel link 1</a>
                                </li>
                                <li>
                                    <a href="" className="megamenu__link">Panel link 2</a>
                                </li>
                                <li>
                                    <a href="" className="megamenu__link">Panel link 3</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="megamenu__item" data-megamenu-item>
                        <a
                            href=""
                            className="megamenu__item-trigger"
                            data-megamenu-trigger
                        >
                            Item two
                            <span className="megamenu__trigger-arrow"></span>
                        </a>
                        <div className="megamenu__panel" data-megamenu-panel>
                            <ul>
                                <li>
                                    <a href="" className="megamenu__link">Panel link 1</a>
                                </li>
                                <li>
                                    <a href="" className="megamenu__link">Panel link 2</a>
                                </li>
                                <li>
                                    <a href="" className="megamenu__link">Panel link 3</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="megamenu__item" data-megamenu-item>
                        <a href="">Item three</a>
                    </div>
                    <div className="megamenu__item" data-megamenu-item>
                        <a
                            href=""
                            className="megamenu__item-trigger"
                            data-megamenu-trigger
                        >
                            Item four
                            <span className="megamenu__trigger-arrow"></span>
                        </a>
                        <div className="megamenu__panel" data-megamenu-panel>
                            <ul>
                                <li>
                                    <a href="" className="megamenu__link">Panel link 1</a>
                                </li>
                                <li>
                                    <a href="" className="megamenu__link">Panel link 2</a>
                                </li>
                                <li>
                                    <a href="" className="megamenu__link">Panel link 3</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page__content">
            </div>
        </div>
    );
};

export default App;
