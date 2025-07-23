# Configuration file for the Sphinx documentation builder.

# -- Project information

project = 'Geometry Nodes Overview'
copyright = '2025, Stephan Kellermayr'
author = 'Quellenform'

version = '4.5'
release = '4.5.0.1'

# -- General configuration

extensions = [
    'sphinx.ext.duration',
    'sphinx.ext.doctest',
    'sphinx.ext.autodoc',
    'sphinx.ext.autosummary',
    'sphinx.ext.intersphinx',
    'sphinx_rtd_theme',
]

intersphinx_mapping = {
    'python': ('https://docs.python.org/3/', None),
    'sphinx': ('https://www.sphinx-doc.org/en/master/', None),
}
intersphinx_disabled_domains = ['std']

templates_path = ['_templates']

# -- Options for HTML output
# https://sphinx-rtd-theme.readthedocs.io/en/stable/configuring.html
html_theme = 'sphinx_rtd_theme'
html_logo = 'images/logo.png'
html_favicon = 'images/icon.ico'
html_theme_options = {
    'analytics_anonymize_ip': True,
    'logo_only': False,
    'titles_only': False,
    'display_github': 'raw',
    'collapse_navigation': False,
    'sticky_navigation': True,
    'navigation_depth': 2,
    'titles_only': True
}
html_static_path = ['_static']
html_css_files = [
    'custom.css'
]
# -- Options for EPUB output
epub_show_urls = 'footnote'
