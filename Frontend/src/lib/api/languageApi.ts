export interface LTMatch {
    message: string;
    replacements: { value: string }[];
    offset: number;
    length: number;
  }
  
  export async function checkSpellingWithLT(text: string, lang = "es") {
    const params = new URLSearchParams({ text, language: lang });
    const res = await fetch(
      `https://api.languagetool.org/v2/check?${params.toString()}`,
      { method: "POST" }
    );
    if (!res.ok) throw new Error("LanguageTool error");
    const json = await res.json();
    return json.matches as LTMatch[];
  }
  