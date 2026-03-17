import Papa from "papaparse"
export const convertToCSV = (data, filename = "expenses") => {
    //Check if the data exist or not 
    if (!data || !data.length) return
    // Convert the data of json to csv
    const csv = Papa.unparse(data)

    // Create the blob and link 
    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    })
    const url = URL.createObjectURL(blob)
    // Create an anchor element and click if for download
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}