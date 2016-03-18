// Copyright (c) 2016, hendrik and contributors
// For license information, please see license.txt

frappe.ui.form.on('Est Tools', {
	refresh: function(frm) {
		var me = this;
		if(frm.doc.docstatus==1) {
			cur_frm.add_custom_button(__('Make BOM'), cur_frm.cscript['Make BOM'], "icon-exclamation", "btn-default");
		};

		calculate_total_quantity(frm);
		calculate_total_secondary(frm);
		
		if(frm.doc.__islocal) {
			cur_frm.add_custom_button(__('Quotation'),
				function() {
					frappe.model.map_current_doc({
						method: "tambahan.tambahan.doctype.est_tools.est_tools.get_item_from_quotation",
						source_doctype: "Quotation",
						get_query_filters: {
							docstatus: 1,
							status: ["!=", "Lost"]
						}
					})
				}, __("Get items from"));
			cur_frm.add_custom_button(__('Sales Order'),
				function() {
					frappe.model.map_current_doc({
						method: "tambahan.tambahan.doctype.est_tools.est_tools.get_item_from_so",
						source_doctype: "Sales Order",
						get_query_filters: {
							docstatus: 1
						}
					})
				}, __("Get items from"));
		};
	},
	get_items_from_bom: function(frm) {
		return frappe.call({
			method: "get_details",
			doc: frm.doc,
			callback: function(r, rt) {
				frm.refresh()
			}
		});
	},
});

cur_frm.cscript['Make BOM'] = function() {
	frappe.model.open_mapped_doc({
		method: "tambahan.tambahan.doctype.est_tools.est_tools.make_bom",
		frm: cur_frm
	})
}

/*
cur_frm.set_query('item_code', function () {
    return {
        filters: {
            'item_group': 'Products'
        }
    }
});
*/
// filter BOM dari item
cur_frm.set_query('bill_of_material', function (frm) {
    return {
        filters: {
            'item': frm.item_code
        }
    }
});

cur_frm.set_query("item_code", "item_utama",  function (doc, cdt, cdn) {
	var c_doc= locals[cdt][cdn];
    return {
        filters: {
            'item_group': c_doc.item_group
        }
    }
});
cur_frm.set_query("item_code", "item_tambahan",  function (doc, cdt, cdn) {
	var c_doc= locals[cdt][cdn];
    return {
        filters: {
            'item_group': c_doc.item_group
        }
    }
});

/* item_utama */
cur_frm.cscript.factor_1 = function(doc, cdt, cdn) {
	var d = locals[cdt][cdn];
		d.amount = flt(d.price_list_rate) * flt(d.quantity);
        d.net_amount = flt(d.quantity) * flt(d.price_list_rate) * flt(d.factor_1) * flt(d.factor_2) * flt(d.factor_3) * flt(d.factor_4) * flt(d.factor_5);
        d.rate = flt(d.price_list_rate) * flt(d.factor_1) * flt(d.factor_2) * flt(d.factor_3) * flt(d.factor_4) * flt(d.factor_5);

	refresh_field('amount', d.name, 'item_utama');
	refresh_field('rate', d.name, 'item_utama');
	refresh_field('net_amount', d.name, 'item_utama');
}
cur_frm.cscript.factor_5 = cur_frm.cscript.factor_4 = cur_frm.cscript.factor_3 = cur_frm.cscript.factor_2 = cur_frm.cscript.factor_1;
cur_frm.cscript.price_list_rate = cur_frm.cscript.quantity = cur_frm.cscript.factor_1;

var calculate_total_quantity = function(frm) {
    var total_quantity = frappe.utils.sum(
        (frm.doc.item_utama || []).map(function(i) {
			return (i.quantity * i.price_list_rate * i.factor_1 * i.factor_2 * i.factor_3 * i.factor_4 * i.factor_5);
		})
    );
    frm.set_value("total_primary_item", total_quantity);
}

frappe.ui.form.on("Est Tools Primary Item", "quantity", function(frm, cdt, cdn) {
    calculate_total_quantity(frm, cdt, cdn);
})
frappe.ui.form.on("Est Tools Primary Item", "price_list_rate", function(frm, cdt, cdn) {
    calculate_total_quantity(frm, cdt, cdn);
})
frappe.ui.form.on("Est Tools Primary Item", "factor_1", function(frm, cdt, cdn) {
    calculate_total_quantity(frm, cdt, cdn);
})
frappe.ui.form.on("Est Tools Primary Item", "factor_2", function(frm, cdt, cdn) {
    calculate_total_quantity(frm, cdt, cdn);
})
frappe.ui.form.on("Est Tools Primary Item", "factor_3", function(frm, cdt, cdn) {
    calculate_total_quantity(frm, cdt, cdn);
})
frappe.ui.form.on("Est Tools Primary Item", "factor_4", function(frm, cdt, cdn) {
    calculate_total_quantity(frm, cdt, cdn);
})
frappe.ui.form.on("Est Tools Primary Item", "factor_5", function(frm, cdt, cdn) {
    calculate_total_quantity(frm, cdt, cdn);
})
/*
frappe.ui.form.on("Est Tools", "refresh", function(frm) {
  calculate_total_quantity(frm);
});*/

// total faktor primary
var calculate_excess_amount = function(frm) {
	var excess_amount = flt(frm.doc.faktor_primary) * flt(frm.doc.total_primary_item);
	frm.set_value("net_total_primary_item", excess_amount);
}
frappe.ui.form.on("Est Tools", "total_primary_item", function(frm) {
	calculate_excess_amount(frm);
})
frappe.ui.form.on("Est Tools", "faktor_primary", function(frm) {
	calculate_excess_amount(frm);
})

//frappe.ui.form.on("Est Tools Primary Item", "item_code", function(frm, cdt, cdn) {
//	row = locals[cdt][cdn];
//	frappe.call({
//		method: "frappe.client.get",
//		args: {
//			doctype: "Item Price",
//			filters: {
//				"item_code": row.item_code,
//				"price_list": "Standard Selling"
//			}
//		},
//		callback: function (data) {
//			if(!data.exc){
//				frappe.model.set_value(cdt, cdn, "price_list_rate", data.message.price_list_rate);
//				frappe.model.set_value(cdt, cdn, "quantity", "1");
//			}
//		}
//	})
//})
frappe.ui.form.on("Est Tools Primary Item", "item_code", function(frm, cdt, cdn) {
    row = locals[cdt][cdn];
	frappe.model.set_value(cdt, cdn, "price_list_rate", "0");
    frappe.call({
        method: "frappe.client.get_value",
        args: {
            doctype: "Item Price",
            fieldname: "price_list_rate",
            filters: {
				"item_code": row.item_code,
				"price_list": "Standard Selling"
            }
        },
        callback: function (data) {
            frappe.model.set_value(cdt, cdn, "price_list_rate", data.message.price_list_rate); //might need to be data.message[0]
			//refresh_field()
		}
    })
});

//secondary item
frappe.ui.form.on("Est Tools Secondary Item", "item_code", function(frm, cdt, cdn) {
    row = locals[cdt][cdn];
	frappe.model.set_value(cdt, cdn, "si_price_list_rate", "0");
    frappe.call({
        method: "frappe.client.get_value",
        args: {
            doctype: "Item Price",
            fieldname: "price_list_rate",
            filters: {
				"item_code": row.item_code,
				"price_list": "Standard Selling"
            }
        },
        callback: function (data) {
            frappe.model.set_value(cdt, cdn, "si_price_list_rate", data.message.price_list_rate); 
		}
    })
});
frappe.ui.form.on("Est Tools Primary Item", "template_factor", function(frm, cdt, cdn) {
    row = locals[cdt][cdn];
	frappe.model.set_value(cdt, cdn, "factor_1", "1");
	frappe.model.set_value(cdt, cdn, "factor_2", "1");
	frappe.model.set_value(cdt, cdn, "factor_3", "1");
	frappe.model.set_value(cdt, cdn, "factor_4", "1");
	frappe.model.set_value(cdt, cdn, "factor_5", "1");
    frappe.call({
        method: "frappe.client.get_value",
        args: {
            doctype: "Factor",
            fieldname: ["factor_01","factor_02","factor_03","factor_04","factor_05"],
            filters: {
				"name": row.template_factor
            }
        },
        callback: function (data) {
            frappe.model.set_value(cdt, cdn, "factor_1", data.message.factor_01);
            frappe.model.set_value(cdt, cdn, "factor_2", data.message.factor_02);
            frappe.model.set_value(cdt, cdn, "factor_3", data.message.factor_03);
            frappe.model.set_value(cdt, cdn, "factor_4", data.message.factor_04);
            frappe.model.set_value(cdt, cdn, "factor_5", data.message.factor_05);
		}
    })
});
frappe.ui.form.on("Est Tools Secondary Item", "template_factor", function(frm, cdt, cdn) {
    row = locals[cdt][cdn];
	frappe.model.set_value(cdt, cdn, "si_factor_1", "1");
	frappe.model.set_value(cdt, cdn, "si_factor_2", "1");
	frappe.model.set_value(cdt, cdn, "si_factor_3", "1");
	frappe.model.set_value(cdt, cdn, "si_factor_4", "1");
	frappe.model.set_value(cdt, cdn, "si_factor_5", "1");
    frappe.call({
        method: "frappe.client.get_value",
        args: {
            doctype: "Factor",
            fieldname: ["factor_01","factor_02","factor_03","factor_04","factor_05"],
            filters: {
				"name": row.template_factor
            }
        },
        callback: function (data) {
            frappe.model.set_value(cdt, cdn, "si_factor_1", data.message.factor_01);
            frappe.model.set_value(cdt, cdn, "si_factor_2", data.message.factor_02);
            frappe.model.set_value(cdt, cdn, "si_factor_3", data.message.factor_03);
            frappe.model.set_value(cdt, cdn, "si_factor_4", data.message.factor_04);
            frappe.model.set_value(cdt, cdn, "si_factor_5", data.message.factor_05);
		}
    })
});


cur_frm.cscript.si_qty = function(doc, cdt, cdn) {
	var d = locals[cdt][cdn];
		d.si_amount = flt(d.si_price_list_rate) * flt(d.si_qty);
        d.si_net_amount = flt(d.si_qty) * flt(d.si_price_list_rate) * flt(d.si_factor_1) * flt(d.si_factor_2) * flt(d.si_factor_3) * flt(d.si_factor_4) * flt(d.si_factor_5);
        d.si_rate = flt(d.si_price_list_rate) * flt(d.si_factor_1) * flt(d.si_factor_2) * flt(d.si_factor_3) * flt(d.si_factor_4) * flt(d.si_factor_5);

	refresh_field('si_amount', d.name, 'item_tambahan');
	refresh_field('si_rate', d.name, 'item_tambahan');
	refresh_field('si_net_amount', d.name, 'item_tambahan');
}
cur_frm.cscript.si_factor_5 = cur_frm.cscript.si_factor_4 = cur_frm.cscript.si_factor_3 = cur_frm.cscript.si_factor_2 = cur_frm.cscript.si_factor_1 = cur_frm.cscript.si_qty;
cur_frm.cscript.si_price_list_rate = cur_frm.cscript.si_qty;

var calculate_total_secondary = function(frm) {
    var total_secondary = frappe.utils.sum(
        (frm.doc.item_tambahan || []).map(function(i) {
			return (i.si_qty * i.si_price_list_rate * i.si_factor_1 * i.si_factor_2 * i.si_factor_3 * i.si_factor_4 * i.si_factor_5);
		})
    );
    frm.set_value("total_secondary_item", total_secondary);
}

frappe.ui.form.on("Est Tools Secondary Item", "si_qty", function(frm, cdt, cdn) {
    calculate_total_secondary(frm, cdt, cdn);
})
frappe.ui.form.on("Est Tools Secondary Item", "si_price_list_rate", function(frm, cdt, cdn) {
    calculate_total_secondary(frm, cdt, cdn);
})
frappe.ui.form.on("Est Tools Secondary Item", "si_factor_1", function(frm, cdt, cdn) {
    calculate_total_secondary(frm, cdt, cdn);
})
frappe.ui.form.on("Est Tools Secondary Item", "si_factor_2", function(frm, cdt, cdn) {
    calculate_total_secondary(frm, cdt, cdn);
})
frappe.ui.form.on("Est Tools Secondary Item", "si_factor_3", function(frm, cdt, cdn) {
    calculate_total_secondary(frm, cdt, cdn);
})
frappe.ui.form.on("Est Tools Secondary Item", "si_factor_4", function(frm, cdt, cdn) {
    calculate_total_secondary(frm, cdt, cdn);
})
frappe.ui.form.on("Est Tools Secondary Item", "si_factor_5", function(frm, cdt, cdn) {
    calculate_total_secondary(frm, cdt, cdn);
})

// total faktor secondary
var calculate_faktor_secondary = function(frm) {
	var excess_amount = flt(frm.doc.faktor_secondary) * flt(frm.doc.total_secondary_item);
	frm.set_value("net_total_secondary_item", excess_amount);
}
frappe.ui.form.on("Est Tools", "total_secondary_item", function(frm) {
	calculate_faktor_secondary(frm);
})
frappe.ui.form.on("Est Tools", "faktor_secondary", function(frm) {
	calculate_faktor_secondary(frm);
})

/* Net Total */
var calculate_net_total = function(frm) {
	var net_total = flt(frm.doc.net_total_primary_item) + flt(frm.doc.net_total_secondary_item);
	frm.set_value("net_total", net_total);
}
frappe.ui.form.on("Est Tools", "net_total_secondary_item", function(frm) {
	calculate_net_total(frm);
})
frappe.ui.form.on("Est Tools", "net_total_primary_item", function(frm) {
	calculate_net_total(frm);
})
/* Grand Total */
var calculate_grand_total = function(frm) {
	var net_total_after_factor = flt(frm.doc.net_total) * flt(frm.doc.factor_total_1);
	var grand_total = flt(frm.doc.net_total) * flt(frm.doc.factor_total_1) * flt(frm.doc.factor_total_2);
	var rounded_total = flt(grand_total) + flt(frm.doc.pembulatan);
	frm.set_value("net_total_after_factor", net_total_after_factor);
	frm.set_value("grand_total", grand_total);
	frm.set_value("rounded_total", rounded_total);
}
frappe.ui.form.on("Est Tools", "net_total", function(frm) {
	calculate_grand_total(frm);
})
frappe.ui.form.on("Est Tools", "factor_total_1", function(frm) {
	calculate_grand_total(frm);
})
frappe.ui.form.on("Est Tools", "factor_total_2", function(frm) {
	calculate_grand_total(frm);
})
frappe.ui.form.on("Est Tools", "pembulatan", function(frm) {
	calculate_grand_total(frm);
})
