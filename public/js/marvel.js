var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuItem = function (_React$Component) {
    _inherits(MenuItem, _React$Component);

    function MenuItem() {
        _classCallCheck(this, MenuItem);

        return _possibleConstructorReturn(this, (MenuItem.__proto__ || Object.getPrototypeOf(MenuItem)).apply(this, arguments));
    }

    _createClass(MenuItem, [{
        key: "render",
        value: function render() {
            if (this.props.list === null) {
                return React.createElement(
                    "div",
                    { className: "menuItem" },
                    React.createElement(
                        "a",
                        { className: "bt", href: this.props.url },
                        this.props.text
                    )
                );
            } else {
                return React.createElement(
                    "div",
                    { className: "menuItem" },
                    React.createElement(
                        "a",
                        { className: "bt", href: "#", onClick: this.props.onClick },
                        this.props.text,
                        " \u25BC"
                    ),
                    React.createElement(
                        "div",
                        { className: "list" },
                        this.props.isOpen ? React.createElement(
                            React.Fragment,
                            null,
                            this.props.list.map(function (item) {
                                return React.createElement(
                                    "a",
                                    { className: "point", href: item.url },
                                    item.name
                                );
                            })
                        ) : null
                    )
                );
            }
        }
    }]);

    return MenuItem;
}(React.Component);

var Think = function (_React$Component2) {
    _inherits(Think, _React$Component2);

    function Think(props) {
        _classCallCheck(this, Think);

        var _this2 = _possibleConstructorReturn(this, (Think.__proto__ || Object.getPrototypeOf(Think)).call(this, props));

        _this2.state = {
            isOpen: [false, false, false]
        };
        return _this2;
    }

    _createClass(Think, [{
        key: "handleClick",
        value: function handleClick(i) {
            var tbi = this.state.isOpen[i];
            var tb = [false, false, false];
            tb[i] = !tbi;
            this.setState({
                isOpen: tb
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            var list0 = [{ name: "Железный человек", url: "/marvel/films?film=IronMan" }, { name: "Невероятный Халк", url: "/marvel/films?film=TheIncredibleHulk" }, { name: "Железный человек 2", url: "/marvel/films?film=IronMan2" }, { name: "Тор", url: "/marvel/films?film=Thor" }, { name: "Первый мститель", url: "/marvel/films?film=CaptainAmericaTheFirstAvenger" }, { name: "Мстители", url: "/marvel/films?film=TheAvengers" }];
            var list1 = [{ name: "Железный человек 3", url: "/marvel/films?film=IronMan3" }, { name: "Тор 2: Царство тьмы", url: "/marvel/films?film=ThorTheDarkWorld" }, { name: "Первый мститель: Другая война", url: "/marvel/films?film=CaptainAmericaTheWinterSoldier" }, { name: "Стражи Галактики", url: "/marvel/films?film=GuardiansOfTheGalaxy" }, { name: "Мстители: Эра Альтрона", url: "/marvel/films?film=AvengersAgeOfUltron" }, { name: "Человек-муравей", url: "/marvel/films?film=AntMan" }];
            var list2 = [{ name: "Первый мститель: Противостояние", url: "/marvel/films?film=CaptainAmericaCivilWar" }, { name: "Доктор Стрэндж", url: "/marvel/films?film=DoctorStrange" }, { name: "Стражи Галактики. Часть 2", url: "/marvel/films?film=GuardiansOfTheGalaxyVol2" }, { name: "Человек-паук: Возвращение домой", url: "/marvel/films?film=SpiderManHomecoming" }, { name: "Тор: Рагнарёк", url: "/marvel/films?film=ThorRagnarok" }, { name: "Чёрная Пантера", url: "/marvel/films?film=BlackPanther" }, { name: "Мстители: Война бесконечности", url: "/marvel/films?film=AvengersInfinityWar" }, { name: "Человек-муравей и Оса", url: "/marvel/films?film=AntManAndTheWasp" }, { name: "Капитан Марвел", url: "/marvel/films?film=CaptainMarvel" }, { name: "Мстители: Финал", url: "/marvel/films?film=AvengersEndgame" }, { name: "Человек-паук: Вдали от дома", url: "/marvel/films?film=SpiderManFarFromHome" }];

            return React.createElement(
                "div",
                { className: "top1" },
                React.createElement(
                    "div",
                    { className: "top2" },
                    React.createElement(
                        "a",
                        { href: "/marvel" },
                        React.createElement("img", { className: "logo", src: "/img/Marvel.jpg" })
                    ),
                    React.createElement(
                        "div",
                        { className: "menu" },
                        React.createElement(MenuItem, { text: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F", list: null, url: "/marvel" }),
                        React.createElement(MenuItem, { text: "\u041F\u0435\u0440\u0432\u0430\u044F \u0444\u0430\u0437\u0430", list: list0, isOpen: this.state.isOpen[0], onClick: function onClick() {
                                return _this3.handleClick(0);
                            } }),
                        React.createElement(MenuItem, { text: "\u0412\u0442\u043E\u0440\u0430\u044F \u0444\u0430\u0437\u0430", list: list1, isOpen: this.state.isOpen[1], onClick: function onClick() {
                                return _this3.handleClick(1);
                            } }),
                        React.createElement(MenuItem, { text: "\u0422\u0440\u0435\u0442\u044C\u044F \u0444\u0430\u0437\u0430", list: list2, isOpen: this.state.isOpen[2], onClick: function onClick() {
                                return _this3.handleClick(2);
                            } })
                    )
                )
            );
        }
    }]);

    return Think;
}(React.Component);

var domContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(Think, null), domContainer);