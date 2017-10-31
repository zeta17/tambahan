frappe.treeview_settings["Organisation"] = {
  ignore_fields:["parent_organisation"],
  onrender: function(node) {
		$('<span class="balance-area pull-right text-muted small">'
			+ " " + node.data.value
			+ '</span>').insertBefore(node.$ul);
	},
}
