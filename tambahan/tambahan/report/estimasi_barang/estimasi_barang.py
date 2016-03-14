# Copyright (c) 2013, hendrik and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.utils import flt, getdate

def execute(filters=None):
	#columns, data = [], []
	#return columns, data
	columns = get_columns()
	sl_entries = get_stock_ledger_entries(filters)
	data = []
	
	for sle in sl_entries:
		data.append([sle.name,
			sle.project_name,
			sle.item_code,
			sle.item_name,
			sle.bill_of_material,
			sle.quantity,
			sle.total_primary_item,
			sle.posting_date])
	
	return columns, data

def get_columns():
	"""return columns"""

	columns = [
		_("Est ID")+":Link/Est Tools:120",
		_("Project Name")+":Link/Project:170",
		_("Item Code")+":Link/Item:150",
		_("Item Name")+"::150",
		_("BOM")+":Link/BOM:170",
		_("Quantity")+":Float:100",
		_("Total Komponen")+":Currency:150",
		_("Posting Date")+":Date:100"
	]

	return columns

def get_conditions(filters):
	conditions = ""
	if filters.get("from_date"):
		conditions += " and posting_date >= '%s'" % frappe.db.escape(filters["from_date"])

	if filters.get("to_date"):
		conditions += " and posting_date <= '%s'" % frappe.db.escape(filters["to_date"])
	
	if filters.get("project_name"):
		conditions += " and project_name = '%s'" % frappe.db.escape(filters.get("project_name"), percent=False)
		
	if filters.get("item_code"):
		conditions += " and item_code = '%s'" % frappe.db.escape(filters.get("item_code"), percent=False)
		
	if filters.get("bill_of_material"):
		conditions += " and bill_of_material = '%s'" % frappe.db.escape(filters.get("bill_of_material"), percent=False)

	return conditions

def get_stock_ledger_entries(filters):
	conditions = get_conditions(filters)
	return frappe.db.sql("""select name, project_name, item_code, item_name, bill_of_material, quantity, total_primary_item, posting_date
		from `tabEst Tools`
		where docstatus < 2 %s order by name""" %
		conditions, as_dict=1)
