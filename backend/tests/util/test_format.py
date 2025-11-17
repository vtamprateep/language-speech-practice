from app.util.format import to_camel_case


def test_to_camel_case():
    assert to_camel_case("hello") == "hello"
    assert to_camel_case("") == ""
    assert to_camel_case("camel_case") == "camelCase"
