
import os
import shutil
import argparse

def read_file(path):
    """Reads and prints the content of a file."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            print(f"--- Content of {path} ---")
            print(f.read())
            print("--- End of content ---")
    except FileNotFoundError:
        print(f"Error: File not found at '{path}'")
    except Exception as e:
        print(f"An error occurred: {e}")

def move_file(source, destination):
    """Moves a file or directory."""
    try:
        shutil.move(source, destination)
        print(f"Successfully moved '{source}' to '{destination}'")
    except FileNotFoundError:
        print(f"Error: The source file/directory '{source}' does not exist.")
    except Exception as e:
        print(f"An error occurred: {e}")

def delete_file(path):
    """Deletes a file after confirmation."""
    try:
        if os.path.exists(path):
            # Basic confirmation, can be improved
            confirm = input(f"Are you sure you want to delete '{path}'? [y/N]: ").lower()
            if confirm == 'y':
                os.remove(path)
                print(f"Successfully deleted '{path}'")
            else:
                print("Deletion cancelled.")
        else:
            print(f"Error: File not found at '{path}'")
    except Exception as e:
        print(f"An error occurred: {e}")

def main():
    """Main function to parse arguments and call the appropriate action."""
    parser = argparse.ArgumentParser(description="A simple file management agent.")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Read command
    read_parser = subparsers.add_parser("read", help="Read a file's content")
    read_parser.add_argument("path", help="The path to the file to read")

    # Move command
    move_parser = subparsers.add_parser("move", help="Move a file or directory")
    move_parser.add_argument("source", help="The source path")
    move_parser.add_argument("destination", help="The destination path")

    # Delete command
    delete_parser = subparsers.add_parser("delete", help="Delete a file")
    delete_parser.add_argument("path", help="The path of the file to delete")

    args = parser.parse_args()

    if args.command == "read":
        read_file(args.path)
    elif args.command == "move":
        move_file(args.source, args.destination)
    elif args.command == "delete":
        delete_file(args.path)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
