/**
 * Configuration for Loragica
 * 
 * To link your subscription newsletter form to your Google Sheet with automated quarterly bucketing & duplicate prevention:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/19jIH1S2nGUc9whzzyMsd2f8ASlvcD1wRNmZ5SNGbXN8/edit
 * 2. Click Extensions -> Apps Script.
 * 3. Delete any code inside the editor and paste the following script:
 * 
 *    function doGet(e) {
 *      return handleRequest(e);
 *    }
 * 
 *    function doPost(e) {
 *      return handleRequest(e);
 *    }
 * 
 *    function handleRequest(e) {
 *      try {
 *        var ss = SpreadsheetApp.getActiveSpreadsheet();
 *        var parameter = e.parameter || {};
 *        
 *        // Parse JSON body if present (such as from Contributor POST request)
 *        var data = {};
 *        if (e.postData && e.postData.contents) {
 *          try {
 *            data = JSON.parse(e.postData.contents);
 *          } catch (err) {}
 *        }
 *        
 *        // Merge parameters (prefers parameter query, then JSON body)
 *        var email = parameter.email || data.email;
 *        var nama = parameter.nama || data.nama;
 *        
 *        if (!email) {
 *          return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Email is required" }))
 *            .setMimeType(ContentService.MimeType.JSON)
 *            .setHeader('Access-Control-Allow-Origin', '*');
 *        }
 *        
 *        email = email.trim().toLowerCase();
 *        
 *        // --- 1. DEDUPLICATION (PREVENT DUPLICATE EMAIL WORLDWIDE IN ALL TABS) ---
 *        var sheets = ss.getSheets();
 *        var isDuplicate = false;
 *        
 *        for (var i = 0; i < sheets.length; i++) {
 *          var currentSheet = sheets[i];
 *          var lastRow = currentSheet.getLastRow();
 *          if (lastRow > 1) { // Skip headers
 *            // Scan the first 3 columns for existing emails
 *            var rangeLimit = Math.min(currentSheet.getLastColumn(), 3);
 *            var dataRange = currentSheet.getRange(2, 1, lastRow - 1, rangeLimit);
 *            var values = dataRange.getValues();
 *            for (var r = 0; r < values.length; r++) {
 *              for (var c = 0; c < values[r].length; c++) {
 *                var valStr = values[r][c].toString().trim().toLowerCase();
 *                if (valStr === email) {
 *                  isDuplicate = true;
 *                  break;
 *                }
 *              }
 *              if (isDuplicate) break;
 *            }
 *          }
 *          if (isDuplicate) break;
 *        }
 *        
 *        if (isDuplicate) {
 *          return ContentService.createTextOutput(JSON.stringify({ status: "duplicate", message: "Email already registered" }))
 *            .setMimeType(ContentService.MimeType.JSON)
 *            .setHeader('Access-Control-Allow-Origin', '*');
 *        }
 *        
 *        var now = new Date();
 *        
 *        // --- 2. FORMS ROUTING SYSTEM ---
 *        if (nama) {
 *          // CASE A: THIS IS A CONTRIBUTOR APPLICATION
 *          var sheetName = "Kontributor";
 *          var sheet = ss.getSheetByName(sheetName);
 *          if (!sheet) {
 *            sheet = ss.insertSheet(sheetName);
 *            // Headers for Contributor data
 *            sheet.appendRow([
 *              "Tanggal", "Nama", "Email", "WhatsApp", 
 *              "Institusi", "Jurusan", "Domisili", "Portofolio", 
 *              "Peran (Roles)", "Detail Peran", "Komitmen Jam", "Mulai Ketersediaan", 
 *              "Aturan Volunteer", "Minat Co-Founder", "Alasan", "Ide Program"
 *            ]);
 *          }
 *          
 *          var rolesJoined = Array.isArray(data.roles) ? data.roles.join(", ") : (parameter.roles || data.roles || "");
 *          
 *          sheet.appendRow([
 *            now,
 *            nama,
 *            email,
 *            parameter.whatsapp || data.whatsapp || "",
 *            parameter.institusi || data.institusi || "",
 *            parameter.jurusan || data.jurusan || "",
 *            parameter.domisili || data.domisili || "",
 *            parameter.portofolio || data.portofolio || "",
 *            rolesJoined,
 *            parameter.details || data.details || "",
 *            parameter.jam || data.jam || "",
 *            parameter.ketersediaan || data.ketersediaan || "",
 *            parameter.volunteering || data.volunteering || "",
 *            parameter.cofounder || data.cofounder || "",
 *            parameter.alasan || data.alasan || "",
 *            parameter.ide || data.ide || ""
 *          ]);
 *          
 *        } else {
 *          // CASE B: THIS IS A STANDARD NEWSLETTER SUBSCRIPTION
 *          var month = now.getMonth(); // 0 = Jan, 11 = Dec
 *          var year = now.getFullYear();
 *          var quarter = "Q" + (Math.floor(month / 3) + 1);
 *          var quarterName = quarter + " " + year; // Example: "Q1 2026"
 *          
 *          var sheet = ss.getSheetByName(quarterName);
 *          if (!sheet) {
 *            sheet = ss.insertSheet(quarterName);
 *            sheet.appendRow(["Tanggal", "Email", "Quarter"]); // Headers
 *          }
 *          sheet.appendRow([now, email, quarterName]);
 *          
 *          // Add to main tab (first tab) as backup
 *          try {
 *            var defaultSheet = ss.getSheets()[0];
 *            if (defaultSheet && defaultSheet.getName() !== quarterName && defaultSheet.getName() !== "Kontributor") {
 *              defaultSheet.appendRow([now, email, quarterName]);
 *            }
 *          } catch (err) {
 *            // ignore
 *          }
 *        }
 *        
 *        return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
 *          .setMimeType(ContentService.MimeType.JSON)
 *          .setHeader('Access-Control-Allow-Origin', '*');
 *          
 *      } catch (error) {
 *        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
 *          .setMimeType(ContentService.MimeType.JSON)
 *          .setHeader('Access-Control-Allow-Origin', '*');
 *      }
 *    }
 * 
 * 4. Click 'Deploy' -> 'New deployment' (or 'Manage deployments' -> 'Edit' to update).
 * 5. Select type: 'Web app'.
 * 6. Set 'Execute as': 'Me' (your email).
 * 7. Set 'Who has access': 'Anyone'.
 * 8. Click 'Deploy' and copy the 'Web app URL' if it changed, then paste it in googleSheetsWebhookUrl below.
 */

export const config = {
  // Paste your Google Apps Script Web App URL below
  googleSheetsWebhookUrl: "https://script.google.com/macros/s/AKfycbxxRRaVkghUK9nUBduBsFQXuN79ruhdfWpvpjUTIxiXhFWY4RFt4C5QX9-f_mFwRd4zIg/exec"
};
