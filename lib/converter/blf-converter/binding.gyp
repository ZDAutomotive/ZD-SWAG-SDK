{
  "targets": [
    {
        "target_name": "blf-converter",
        "sources": [ "blf-converter.cpp", "blf-converter-node.cc"],

		"cflags": [ "-std=c++11" ],
        'cflags_cc!': [ "-fno-exceptions","-fno-rtti" ],

        "include_dirs": ["/usr/local/include"],
        'link_settings': {
            'libraries': ["-lVector_BLF", "-L/usr/local/lib"]
      	}
      	
    }]
}
