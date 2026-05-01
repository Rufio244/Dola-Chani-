/**
 * 🐾 ANIMAL DECODING ENGINE (Based on your Audio Notes)
 */
const translateAnimalLanguage = (audioPattern) => {
    // ตรรกะนี้ดึงมาจากรูปแบบที่คุณเคยแกะ: จังหวะ, โทน และการเว้นวรรค
    const pattern = audioPattern.toLowerCase();
    
    let interpretation = "";

    // ตัวอย่างการ Mapping ตามโน้ตที่คุณแกะ (สามารถเพิ่ม/แก้ไขตามโน้ตจริงของคุณได้)
    if (pattern.includes("สั้น") && pattern.includes("3 ครั้ง")) {
        interpretation = "แจ้งเตือน/พบสิ่งผิดปกติในอาณาเขต (Alert Status)";
    } else if (pattern.includes("ต่ำ") && pattern.includes("ลากยาว")) {
        interpretation = "ต้องการพื้นที่ส่วนตัว หรือรู้สึกไม่ปลอดภัย (Stress/Warning)";
    } else if (pattern.includes("สูง") && pattern.includes("สลับต่ำ")) {
        interpretation = "การสื่อสารเพื่อเรียกหา หรือเช็คตำแหน่งสมาชิกในกลุ่ม (Social Call)";
    } else {
        interpretation = "อยู่ในระหว่างการวิเคราะห์รูปแบบใหม่ (Need more context)";
    }

    return interpretation;
};

/**
 * 🚀 ENDPOINT สำหรับแปลภาษาโดยเฉพาะ
 */
app.post("/chani/translate-animal", async (req, res) => {
    const { audio_note, behavior_context } = req.body;
    
    // 1. แปลด้วยตรรกะจากโน้ตเสียงที่คุณแกะ
    const personalInterpretation = translateAnimalLanguage(audio_note);
    
    // 2. ให้ AI ช่วยวิเคราะห์เสริมจากฐานข้อมูลปี 2026
    const aiPrompt = `Translate this animal behavior: Sound pattern is "${audio_note}" and behavior is "${behavior_context}". Use scientific data 2026.`;
    const aiInsight = await AI_ENGINES.openai(aiPrompt);

    const result = {
        personal_note_translation: personalInterpretation,
        ai_scientific_insight: aiInsight,
        status: "Decoded"
    };

    // บันทึกลงความจำ (Skills)
    db.skills.push({ id: uuidv4(), type: "Animal_Translation", result, date: new Date() });
    saveDB();

    res.json(result);
});
