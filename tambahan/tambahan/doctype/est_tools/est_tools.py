# -*- coding: utf-8 -*-
# Copyright (c) 2015, hendrik and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.model.naming import make_autoname
from dateutil import parser
from frappe.model.mapper import get_mapped_doc

class EstTools(Document):
	def autoname(self):
		ym = parser.parse(self.posting_date).strftime('%y%m')
		self.name = make_autoname("EST-"+ym+".###")
		
	def validate(self):
		self.total_nol()
		#pass
		#frappe.throw(_("Anda pilih: "+self.item_name))
		
	def total_nol(self):
		if(self.grand_total == 0):
			frappe.throw(_("Please enter Komponen Utama / Komponen Tambahan"))
	
	def get_details(self):
		komponen = frappe.db.sql("""SELECT b1.item_code, b1.item_name, b1.qty, b1.stock_uom, b1.rate, b1.amount, b2.item_group
			FROM `tabBOM Item` b1, `tabItem` b2
			WHERE b1.item_code = b2.item_code AND b1.parent = %s
			ORDER by b1.idx ASC""", self.bill_of_material, as_dict=1)
		
		self.set('item_utama', [])
		
		for d in komponen:
			nl = self.append('item_utama', {})
			nl.item_group = d.item_group
			nl.item_code = d.item_code
			nl.item_name = d.item_name
			nl.quantity = d.qty
			nl.uom = d.stock_uom
			nl.price_list_rate = d.rate
			nl.rate = d.rate
			nl.amount = d.amount
			nl.net_amount = d.amount
			nl.factor_1 = "1"
			nl.factor_2 = "1"
			nl.factor_3 = "1"
			nl.factor_4 = "1"
			nl.factor_5 = "1"	
			
		qq = frappe.db.sql("""SELECT b1.quantity FROM `tabBOM` b1 WHERE b1.`name` = %s""", self.bill_of_material, as_dict=1)
		
		for e in qq:
			self.quantity = e.quantity
			
@frappe.whitelist()
def make_bom(source_name, target_doc=None):
	doc = get_mapped_doc("Est Tools", source_name, {
		"Est Tools": {
			"doctype": "BOM",
			"field_map": {
				"item_code": "item"
			},
			"validation": {
				"docstatus": ["=", 1]
			}
		},
		"Est Tools Primary Item": {
			"doctype": "BOM Item",
			"field_map": {
				"quantity": "qty",
				"uom": "stock_uom",
				"net_amount": "amount"
			}
		},
		"Est Tools Secondary Item": {
			"doctype": "BOM Item",
			"field_map": {
				"si_qty": "qty",
				"uom": "stock_uom",
				"si_rate":"rate",
				"si_net_amount": "amount"
			}
		},
	}, target_doc)
	
	return doc

@frappe.whitelist()
def get_item_from_quotation(source_name, target_doc=None):
	est = get_mapped_doc("Quotation", source_name, {
			"Quotation": {
				"doctype": "Est Tools",
				"validation": {
					"docstatus": ["=", 1]
				},
				"field_map": {
					"transaction_date": "posting_date"
				},
			},
			"Quotation Item": {
				"doctype": "Est Tools Primary Item",
				"field_map": {
					"parent": "prevdoc_docname",
					"qty": "quantity"
				},
			},
		}, target_doc)
	
	return est
	
@frappe.whitelist()
def get_item_from_so(source_name, target_doc=None):
	est = get_mapped_doc("Sales Order", source_name, {
			"Sales Order": {
				"doctype": "Est Tools",
				"validation": {
					"docstatus": ["=", 1]
				}
			},
			"Sales Order Item": {
				"doctype": "Est Tools Primary Item",
				"field_map": {
					"parent": "prevdoc_docname",
					"qty": "quantity"
				},
			},
		}, target_doc)
	
	return est

# ERRPR SAAT UPDATE BENCH VERSION 2
# error: <class 'xmlrpclib.Fault'>, <Fault 10: 'BAD_NAME: frappe-bench-processes'>: file: /usr/lib/python2.7/xmlrpclib.py line: 794
# mv config config-bak
# mkdir -p config/pids
# sudo supervisorctl stop all
# sudo service nginx stop
# bench setup config
# bench setup redis
# bench setup supervisor
# bench setup nginx
# bench setup procfile
# sudo bench setup sudoers frappe # or the user that you used to install erpnext
# sudo nginx -t  # check if this command shows any error 
# sudo service nginx reload    
# sudo supervisorctl reread
# sudo supervisorctl update