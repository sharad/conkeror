
/*
 *
 *
 */
function report_assertion (desc, passfail) {
    conkeror.dumpln ("test: " + desc + " ... " + (passfail ? "pass" : "fail"));
}

function assert_that (suite, desc, thing) {
    report_assertion (desc, (thing ? true : false));
}

function assert_not (suite, desc, thing) {
    report_assertion (desc, (thing ? false : true));
}

function assert_equal (suite, desc, expected, actual) {
    report_assertion (desc, (expected == actual ? true : false));
}

function tree_equal (a, b) {
    if (typeof a == 'string' && typeof b == 'string') {
        return a == b;
    } else if (typeof a == 'object' && typeof b == 'object') {
        if (a.length != b.length) {
            return false;
        }
        for (var i = 0; i < a.length; i++) {
            if (! tree_equal (a[i], b[i])) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

assert_that ("batchjs", "tree_equal 1", tree_equal ("a", "a"));
assert_that ("batchjs", "tree_equal 2", tree_equal ([], []));
assert_that ("batchjs", "tree_equal 3", tree_equal (["b"], ["b"]));
assert_that ("batchjs", "tree_equal 4", tree_equal ([["b"]], [["b"]]));
assert_that ("batchjs", "tree_equal 5", tree_equal ([["b"],"c"], [["b"],"c"]));
assert_not ("batchjs", "not tree_equal 1", tree_equal ("a", "b"));
assert_not ("batchjs", "not tree_equal 2", tree_equal ("a", []));
assert_not ("batchjs", "not tree_equal 3", tree_equal ([[]], []));

// check the behavior of the `%' operator.  We depend on this to be a
// remainder, rather than modulus, in the frameset/iframe commands.
//
assert_equal ("batchjs", "% means REMAINDER, not MODULUS", -4, -4 % 7);

// test conkeror.encode_xpcom_structure and conkeror.decode_xpcom_structure.
//
assert_equal ("batchjs", "conkeror.encode_xpcom_structure encodes string",
              "foo",
              conkeror.encode_xpcom_structure ("foo")
              .QueryInterface (Components.interfaces.nsISupportsString)
              .data);

function test_decode_xpcom_string () {
    var data = Components.classes["@mozilla.org/supports-string;1"]
        .createInstance(Components.interfaces.nsISupportsString);
    data.data = "bar";
    assert_equal ("batchjs", "conkeror.decode_xpcom_structure decodes string",
                  "bar",
                  conkeror.decode_xpcom_structure (data));
}
test_decode_xpcom_string ();


assert_equal ("batchjs", "decode_xpcom_structure (encode_xpcom_structure ( ... )) 1",
              "a",
              conkeror.decode_xpcom_structure (
                  conkeror.encode_xpcom_structure (
                      "a")));

assert_that ("batchjs", "decode_xpcom_structure (encode_xpcom_structure ( ... )) 2",
             tree_equal ([],
                         conkeror.decode_xpcom_structure (
                             conkeror.encode_xpcom_structure (
                                 []))));

assert_that ("batchjs", "decode_xpcom_structure (encode_xpcom_structure ( ... )) 3",
             tree_equal (["a"],
                         conkeror.decode_xpcom_structure (
                             conkeror.encode_xpcom_structure (
                                 ["a"]))));

assert_that ("batchjs", "decode_xpcom_structure (encode_xpcom_structure ( ... )) 4",
             tree_equal ([["foo", "bar"], "baz", ["quux"]],
                         conkeror.decode_xpcom_structure (
                             conkeror.encode_xpcom_structure (
                                 [["foo", "bar"], "baz", ["quux"]]))));