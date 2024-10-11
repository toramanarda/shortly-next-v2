const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6YXRqbWR5b3RxaWdycmxycnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MDI2NjUsImV4cCI6MjA0MzM3ODY2NX0.QcXRZ82w4MCZ_UlpAsZCxHLlAgoHh6YNz3FYC9d6MW8"


export const defaultHeader = {
  "apikey": apikey,
  "Authorization": `Bearer ${apikey}`,
  "Content-Type": "application/json"
}