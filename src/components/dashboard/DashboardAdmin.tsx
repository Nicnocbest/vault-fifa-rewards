import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function LootDropEditor() {
  const [title, setTitle] = useState("");
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sendLootDrop = async () => {
    setMessage("");
    setErrorMessage("");

    if (!title || coins <= 0) {
      setErrorMessage("⚠️ Bitte Titel und gültige Coin-Anzahl eingeben!");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Lootdrop-Eintrag erstellen
      const { error: lootError } = await supabase
        .from("lootdrops")
        .insert([{ title, coins, created_at: new Date() }]);

      if (lootError) throw lootError;

      // 2️⃣ Alle User Coins gutschreiben
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("id, coins");

      if (usersError) throw usersError;

      const updates = users.map((user) => ({
        id: user.id,
        coins: (user.coins || 0) + coins,
      }));

      const { error: updateError } = await supabase
        .from("profiles")
        .upsert(updates);

      if (updateError) throw updateError;

      // 3️⃣ Erfolgsmeldung
      setMessage(`🎁 Lootdrop "${title}" verteilt! 💰 +${coins} Coins an ${users.length} Spieler ✅`);
      setTitle("");
      setCoins(0);

    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Fehler beim Senden des Lootdrops! Bitte Konsole prüfen.");
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

      {message && <p className="mt-3 text-green-400">{message}</p>}
      {errorMessage && <p className="mt-3 text-red-400">{errorMessage}</p>}
    </div>
  );
}
