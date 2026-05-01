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
/**
 * 📄 OFFICE DOCUMENT ENGINE
 * เรียนรู้โครงสร้างจาก MS Office เพื่อร่างเอกสารอัตโนมัติ
 */
const DOCUMENT_TEMPLATES = {
    word: (content) => `[Structure: MS Word Business Letter]\n\n${content}`,
    excel: (data) => `[Structure: MS Excel Spreadsheet Layout]\nFormat: CSV/Table\n\n${data}`,
    ppt: (topic) => `[Structure: MS PowerPoint Presentation]\nSlide 1: Title\nSlide 2: Outline\n\n${topic}`
};

/**
 * 🚀 ENDPOINT สำหรับจัดทำเอกสาร
 */
app.post("/chani/office/create", async (req, res) => {
    const { type, topic, details, language = "Thai" } = req.body;
    
    // สร้าง Prompt ที่เรียนรู้จากรูปแบบ Microsoft Office
    const officePrompt = `
    Act as a Microsoft Office Expert. 
    Task: Create a professional ${type} document in ${language}.
    Topic: ${topic}
    Details: ${details}
    Requirements: Use standard professional formatting (Headings, Bullet points, Professional tone).
    `;

    try {
        const rawContent = await AI_ENGINES.openai(officePrompt);
        const formattedContent = DOCUMENT_TEMPLATES[type] ? DOCUMENT_TEMPLATES[type](rawContent) : rawContent;

        // บันทึกลง Skill (เพื่อให้ระบบจำรูปแบบที่เจ้าของชอบ)
        db.skills.push({ 
            id: uuidv4(), 
            type: `Document_Creation_${type}`, 
            topic, 
            createdAt: new Date() 
        });
        saveDB();

        res.json({
            success: true,
            type: type,
            content: formattedContent
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
/**
 * 🧠 SUPER BRAIN: CONSENSUS ENGINE
 * รวมสมอง OpenAI และ Gemini เข้าด้วยกัน
 */
app.post("/chani/super-brain", async (req, res) => {
    const { prompt } = req.body;

    try {
        // 1. ให้ทั้งสองสมองตอบพร้อมกัน
        const [resOpenAI, resGemini] = await Promise.all([
            AI_ENGINES.openai(prompt),
            AI_ENGINES.gemini(prompt)
        ]);

        // 2. ส่งคำตอบทั้งคู่ให้ AI ตัวที่สาม (หรือตัวใดตัวหนึ่ง) ทำการ "Merge" และ "Verify"
        const mergePrompt = `
        I have two expert answers for the prompt: "${prompt}"
        Answer 1: ${resOpenAI}
        Answer 2: ${resGemini}
        
        Your Task: Compare these two answers, find the common truths, resolve any conflicts, 
        and combine them into one SUPERIOR, highly accurate, and comprehensive response in Thai.
        `;

        const finalSuperAnswer = await AI_ENGINES.openai(mergePrompt);

        // บันทึกความจำระดับ Super Brain
        db.skills.push({ 
            id: uuidv4(), 
            type: "Super_Brain_Integration", 
            topic: prompt.slice(0, 50), 
            date: new Date() 
        });
        saveDB();

        res.json({
            success: true,
            super_answer: finalSuperAnswer,
            individual_views: { openai: resOpenAI, gemini: resGemini }
        });

    } catch (err) {
        res.status(500).json({ error: "Super Brain Sync Error: " + err.message });
    }
});
/**
 * 🚀 CORE EXECUTION: THE SUPER BRAIN (DEFAULT MODE)
 * ระบบจะใช้สมองร่วมกันระหว่าง OpenAI และ Gemini โดยอัตโนมัติ
 */
app.post("/chani/execute", auth, async (req, res) => {
    const { prompt } = req.body;

    try {
        console.log("🧠 Super Brain is processing...");

        // 1. เรียกใช้งานทั้งสองสมองพร้อมกันเพื่อความรวดเร็ว
        const [ans1, ans2] = await Promise.all([
            AI_ENGINES.openai(prompt).catch(e => `OpenAI Error: ${e.message}`),
            AI_ENGINES.gemini(prompt).catch(e => `Gemini Error: ${e.message}`)
        ]);

        // 2. ขั้นตอน Synthesis (การรวมสมอง) 
        // ให้ AI วิเคราะห์จุดที่ดีที่สุดของทั้งสองคำตอบมาสร้างเป็น Super Answer
        const synthesisPrompt = `
        Prompt: "${prompt}"
        Perspective A: ${ans1}
        Perspective B: ${ans2}
        
        Task: รวมคำตอบจากทั้งสองแหล่งเข้าด้วยกัน โดยเลือกส่วนที่ถูกต้องและลึกซึ้งที่สุด 
        หากมีความขัดแย้งกัน ให้ใช้เหตุผลที่สมเหตุสมผลที่สุด และสรุปออกมาเป็นคำตอบเดียวที่สมบูรณ์ในภาษาไทย
        `;

        const superAnswer = await AI_ENGINES.openai(synthesisPrompt);

        // 3. บันทึกลงฐานข้อมูลความจำ
        db.history.push({
            prompt,
            superAnswer,
            sources: { openai: ans1, gemini: ans2 },
            date: new Date()
        });
        saveDB();

        res.json({
            success: true,
            answer: superAnswer,
            logic: "Processed via Super Brain (OpenAI + Gemini Integration)"
        });

    } catch (err) {
        res.status(500).json({ error: "Super Brain Critical Failure: " + err.message });
    }
});
