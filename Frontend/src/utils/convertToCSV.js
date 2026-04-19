import Papa from "papaparse";

export const convertToCSV = (data, filename = "expenses") => {
  if (!data || !data.length) return;

  const csv = Papa.unparse(data);

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`); // ✅ fix extension
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
