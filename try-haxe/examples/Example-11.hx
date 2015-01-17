import haxe.ds.IntMap;

class Test {
	static public function main() {
		var map:IntMap<String> = new IntMap<String>();
		var f = map.set.bind(_, "12");
		$type(map.set); // Int -> String -> Void
		$type(f); // Int -> Void
		f(1);
		f(2);
		f(3);
		trace(map); // {1 => 12, 2 => 12, 3 => 12}
	}
}