import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PAGES = {
    "index.html": "titleHome",
    "about-us.html": "titleAbout",
    "contact.html": "titleContact",
    "pay.html": "titlePay",
    "portfolio.html": "titlePortfolio",
    "public_offer.html": "titleOffer",
}

NAV_REPLACEMENTS = [
    (r'<html lang="[^"]*">', '<html lang="uk">'),
    (r'href="index\.html">Домой', 'href="index.html" data-i18n="nav.home">Головна'),
    (r'href="index\.html">Home', 'href="index.html" data-i18n="nav.home">Головна'),
    (r'href="about-us\.html">О нас', 'href="about-us.html" data-i18n="nav.about">Про нас'),
    (r'href="about-us\.html">о нас', 'href="about-us.html" data-i18n="nav.about">Про нас'),
    (r'href="portfolio\.html">Сертификаты', 'href="portfolio.html" data-i18n="nav.portfolio">Сертифікати'),
    (r'href="contact\.html">Контакт', 'href="contact.html" data-i18n="nav.contact">Контакти'),
    (r'href="pay\.html">Оплата', 'href="pay.html" data-i18n="nav.pay">Оплата'),
    (
        r'href="public_offer\.pdf">Публічна оферта',
        'href="public_offer.html" data-i18n="nav.offer">Публічна оферта',
    ),
]

LANG_SWITCH = """
                        <li class="nav-item gh-lang-switch" role="group" data-i18n-aria="nav.langLabel">
                            <button type="button" class="gh-lang-btn is-active" data-lang="uk">UA</button>
                            <button type="button" class="gh-lang-btn" data-lang="en">EN</button>
                        </li>
"""

I18N_SCRIPTS = """        <script src="js/i18n/translations.js"></script>
        <script src="js/i18n/i18n.js"></script>
"""


def patch_file(fname: str, page_key: str) -> None:
    path = ROOT / fname
    text = path.read_text(encoding="utf-8")

    for pattern, repl in NAV_REPLACEMENTS:
        text = re.sub(pattern, repl, text, flags=re.I)

    if "gh-lang-switch" not in text:
        if 'href="viber2.html"' in text:
            text = text.replace(
                '<li class="nav-item"><a class="nav-link" href="viber2.html" hidden>viber</a></li>',
                LANG_SWITCH
                + '\n                        <li class="nav-item"><a class="nav-link" href="viber2.html" hidden>viber</a></li>',
            )
        else:
            text = re.sub(
                r'(<li class="nav-item"><a class="nav-link" href="public_offer\.pdf"[^>]*>[^<]+</a></li>\s*)',
                r"\1" + LANG_SWITCH,
                text,
                count=1,
            )

    if "data-i18n-page" not in text:
        text = re.sub(
            r"<body([^>]*)>",
            rf'<body\1 data-i18n-page="{page_key}">',
            text,
            count=1,
        )

    if "js/i18n/translations.js" not in text:
        text = text.replace(
            '<script src="js/refactor-enhancements.js"></script>',
            I18N_SCRIPTS + '        <script src="js/refactor-enhancements.js"></script>',
        )

    path.write_text(text, encoding="utf-8")
    print("updated", fname)


if __name__ == "__main__":
    for name, key in PAGES.items():
        patch_file(name, key)
