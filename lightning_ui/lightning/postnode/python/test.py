import tkinter as tk
from tkinter import ttk
import psycopg2
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

db_params = {
    "database": "",
    "user": "",
    "password": "",
    "host": "",
    "port": "",
}


def fetch_data(detector_id):
    conn = psycopg2.connect(**db_params)
    sql_query = (
        "SELECT timestamp, detector,  data AS data FROM public.sample WHERE detector = "
        + str(detector_id)
        + " order by timestamp desc limit 100"
    )
    data = pd.read_sql_query(sql_query, conn)
    conn.close()
    return data


def update_plot(detector_name):
    data = fetch_data(detector_dict[detector_name])
    data["data"] = data["data"].apply(lambda x: list(x))
    ax.clear()

    for index, row in data.iterrows():
        ax.plot(
            range(len(row["data"])),
            row["data"],
            label=f'Timestamp: {row["timestamp"]}',
        )

    ax.set_xlabel("Index")
    ax.set_ylabel("Value")
    ax.set_title("Data Plot Over Time")
    ax.legend()

    canvas.draw()


def on_refresh():
    """Handle the refresh button click."""
    selected_id = detector_var.get()
    update_plot(selected_id)


conn = psycopg2.connect(**db_params)
detector_ids = pd.read_sql_query(
    "SELECT DISTINCT id, display_name FROM public.detector_info order by id desc", conn
)
conn.close()

root = tk.Tk()
root.title("Data Plotter")

detector_var = tk.StringVar()
detector_dict = {
    row["display_name"]: row["id"] for index, row in detector_ids.iterrows()
}
detector_dropdown = ttk.Combobox(
    root, textvariable=detector_var, values=list(detector_dict.keys())
)
detector_dropdown.grid(column=0, row=0)

refresh_button = tk.Button(root, text="Refresh", command=on_refresh)
refresh_button.grid(column=1, row=0)

fig, ax = plt.subplots()
canvas = FigureCanvasTkAgg(fig, master=root)
widget = canvas.get_tk_widget()
widget.grid(column=0, row=1, columnspan=2, sticky="nsew")
root.grid_columnconfigure(0, weight=1)
root.grid_rowconfigure(1, weight=1)
root.mainloop()
