import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function LootDropEditor() {
  const [title, setTitle] = useState("");
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendLootDrop = async () => {
    if (!title || coins <= 0) {
      setMessage("⚠️ Bitte Titel und gültige Coin-Anzahl eingeben!");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("lootdrops")
      .insert([{ title, coins, created_at: new Date() }]);

    if (error) {
      console.error(error);
      setMessage("❌ Fehler beim Senden des Lootdrops!");
    } else {
      setMessage(`🎁 Lootdrop "${title}" mit 💰 ${coins} Coins gesendet!`);
      setTitle("");
      setCoins(0);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded bg-gray-900 text-white shadow-lg">
      <h2 className="text-lg font-bold mb-3">📦 Lootdrop senden</h2>

      <input
        type="text"
        placeholder="📝 Titel des Lootdrops"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-700 bg-gray-800 p-2 w-full mb-2 rounded"
      />

      <input
        type="number"
        placeholder="💰 Anzahl Coins"
        value={coins}
        onChange={(e) => setCoins(parseInt(e.target.value))}
        className="border border-gray-700 bg-gray-800 p-2 w-full mb-3 rounded"
      />

      <Button
        onClick={sendLootDrop}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white w-full"
      >
        {loading ? "📤 Sende..." : "🚀 Lootdrop starten"}
      </Button>

      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}
