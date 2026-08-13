import socket
import threading
import json
import time


# ============================================================
# CONFIGURATION
# ============================================================

ESP32_IP = "10.136.88.24"
TCP_PORT = 5000


# ============================================================
# GLOBAL STATE
# ============================================================

running = True
sock = None


# ============================================================
# TELEMETRY RECEIVER
# ============================================================

def receive_data():

    global running

    buffer = ""

    while running:

        try:

            data = sock.recv(4096)

            if not data:
                print("\n[GROUND] Connection closed by satellite.")
                running = False
                break

            buffer += data.decode(
                errors="ignore"
            )

            # ESP32 sends newline-delimited messages
            while "\n" in buffer:

                line, buffer = buffer.split(
                    "\n",
                    1
                )

                line = line.strip()

                if not line:
                    continue

                print(
                    f"\n<<< SATELLITE: {line}"
                )

                # Try to decode JSON telemetry
                try:

                    packet = json.loads(line)

                    if packet.get("id") == "SFC-001":

                        print_telemetry(packet)

                except json.JSONDecodeError:

                    pass

        except socket.timeout:

            continue

        except Exception as e:

            if running:
                print(
                    f"\n[GROUND] Receive error: {e}"
                )

            running = False
            break


# ============================================================
# TELEMETRY DISPLAY
# ============================================================

def print_telemetry(packet):

    print()
    print("======================================")
    print("       SATELLITE TELEMETRY")
    print("======================================")

    print(
        f"Mission       : {packet.get('mission')}"
    )

    print(
        f"Altitude      : {packet.get('altitude')} km"
    )

    print(
        f"Temperature   : {packet.get('temperature')} °C"
    )

    print(
        f"Radiation     : {packet.get('radiation')}"
    )

    print(
        f"Battery       : {packet.get('battery')} %"
    )

    print(
        f"Solar Power   : {packet.get('solar')} W"
    )

    print(
        f"Roll          : {packet.get('roll')}°"
    )

    print(
        f"Pitch         : {packet.get('pitch')}°"
    )

    print(
        f"Yaw           : {packet.get('yaw')}°"
    )

    print(
        f"Fault Flags   : {packet.get('faults')}"
    )

    print("======================================")


# ============================================================
# SEND COMMAND
# ============================================================

def send_command(command):

    try:

        message = command + "\n"

        sock.sendall(
            message.encode()
        )

        print(
            f"\n>>> GROUND: {command}"
        )

    except Exception as e:

        print(
            f"[GROUND] Send error: {e}"
        )


# ============================================================
# COMMAND MENU
# ============================================================

def command_menu():

    global running

    while running:

        print()
        print("--------------------------------------")
        print("          GROUND CONTROL")
        print("--------------------------------------")

        print("1  - Request telemetry")
        print("2  - Enter safe mode")
        print("3  - Exit safe mode")
        print("4  - Deploy satellite")
        print("5  - Nominal mode")
        print("6  - Inject thermal fault")
        print("7  - Inject radiation fault")
        print("8  - Inject battery fault")
        print("9  - Clear faults")
        print("10 - Reboot flight computer")
        print("0  - Disconnect")

        print("--------------------------------------")

        choice = input(
            "Select command: "
        ).strip()


        if choice == "1":

            send_command(
                "CMD:GET_TELEMETRY"
            )


        elif choice == "2":

            send_command(
                "CMD:ENTER_SAFE"
            )


        elif choice == "3":

            send_command(
                "CMD:EXIT_SAFE"
            )


        elif choice == "4":

            send_command(
                "CMD:DEPLOY"
            )


        elif choice == "5":

            send_command(
                "CMD:NOMINAL"
            )


        elif choice == "6":

            send_command(
                "CMD:FAULT:THERMAL"
            )


        elif choice == "7":

            send_command(
                "CMD:FAULT:RADIATION"
            )


        elif choice == "8":

            send_command(
                "CMD:FAULT:BATTERY"
            )


        elif choice == "9":

            send_command(
                "CMD:CLEAR_FAULTS"
            )


        elif choice == "10":

            send_command(
                "CMD:REBOOT"
            )


        elif choice == "0":

            running = False

            print(
                "[GROUND] Disconnecting..."
            )

            break


        else:

            print(
                "[GROUND] Invalid command."
            )


# ============================================================
# MAIN
# ============================================================

def main():

    global sock
    global running


    print()
    print("======================================")
    print("      SATELLITE GROUND STATION")
    print("======================================")

    print(
        f"Target: {ESP32_IP}:{TCP_PORT}"
    )

    print(
        "[GROUND] Connecting..."
    )


    sock = socket.socket(
        socket.AF_INET,
        socket.SOCK_STREAM
    )

    sock.settimeout(1)


    try:

        sock.connect(
            (
                ESP32_IP,
                TCP_PORT
            )
        )

    except Exception as e:

        print()
        print(
            "[GROUND] CONNECTION FAILED"
        )

        print(e)

        return


    print(
        "[GROUND] Connected to flight computer."
    )


    # Start receiver thread

    receiver = threading.Thread(
        target=receive_data,
        daemon=True
    )

    receiver.start()


    # Start command menu

    try:

        command_menu()

    except KeyboardInterrupt:

        print(
            "\n[GROUND] Interrupted."
        )

        running = False


    try:

        sock.close()

    except:

        pass


    print(
        "[GROUND] Ground station stopped."
    )


if __name__ == "__main__":

    main()