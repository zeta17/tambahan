// Copyright (c) 2016, hendrik and contributors
// For license information, please see license.txt

frappe.query_reports["Estimasi barang"] = {
	"filters": [
		{
			"fieldname":"project_name",
			"label": __("Project Name"),
			"fieldtype": "Link",
			"width": "80",
			"options": "Project",
		},
		{
			"fieldname":"item_code",
			"label": __("Item"),
			"fieldtype": "Link",
			"width": "80",
			"options": "Item",
		},
		{
			"fieldname":"bill_of_material",
			"label": __("BOM"),
			"fieldtype": "Link",
			"width": "80",
			"options": "BOM",
		},
		{
			"fieldname":"from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"width": "80",
			"default": sys_defaults.year_start_date,
			"reqd": 1
		},
		{
			"fieldname":"to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"width": "80",
			"default": frappe.datetime.get_today(),
			"reqd": 1
		},
	]
}
