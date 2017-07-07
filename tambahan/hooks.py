# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "tambahan"
app_title = "Tambahan"
app_publisher = "hendrik"
app_description = "tambahan"
app_icon = "fa fa-bath"
app_color = "#5A0000"
app_email = "hendrik.zeta@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/tambahan/css/tambahan.css"
# app_include_js = "/assets/tambahan/js/tambahan.js"

# include js, css files in header of web template
# web_include_css = "/assets/tambahan/css/tambahan.css"
# web_include_js = "/assets/tambahan/js/tambahan.js"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "tambahan.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "tambahan.install.before_install"
# after_install = "tambahan.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "tambahan.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"tambahan.tasks.all"
# 	],
# 	"daily": [
# 		"tambahan.tasks.daily"
# 	],
# 	"hourly": [
# 		"tambahan.tasks.hourly"
# 	],
# 	"weekly": [
# 		"tambahan.tasks.weekly"
# 	]
# 	"monthly": [
# 		"tambahan.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "tambahan.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "tambahan.event.get_events"
# }

