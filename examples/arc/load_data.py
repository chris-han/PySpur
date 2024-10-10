import os
import json
from typing import Dict, List, Tuple


def load_json_data(json_file_path: str) -> Dict:
    """
    Load JSON data from a given file path.

    Args:
        json_file_path (str): The path to the JSON file.

    Returns:
        Dict: The loaded JSON data.
    """
    with open(json_file_path, "r") as file:
        data = json.load(file)
    return data


def update_data_with_training(data: Dict, train_data: Dict) -> None:
    """
    Update the main data dictionary with training data, adding '.json' to the keys.

    Args:
        data (Dict): The main data dictionary to update.
        train_data (Dict): The training data to incorporate.
    """
    updated_train_data = {f"{name}.json": value for name, value in train_data.items()}
    data.update(updated_train_data)


def get_subset_to_run(loaded_names: List[str], subset_length: int = -1) -> List[str]:
    """
    Determine the subset of names to run based on the 'RUN_ON_SUBSET' environment variable.

    Args:
        loaded_names (List[str]): The list of all loaded names.

    Returns:
        List[str]: The subset of names to run.
    """
    names_subset = loaded_names.copy()

    if subset_length > 0:
        names_subset = names_subset[:subset_length]

    print(f"len(names_subset)={len(names_subset)}")
    print("Running:", names_subset)

    return names_subset


def load_train_eval_test_data(verbose: bool = False) -> Tuple[Dict, Dict, Dict]:
    """
    Main function that loads train, eval, and test datasets.

    Returns:
        Tuple[Dict, Dict, Dict]: The train, eval, and test datasets.
    """
    # Load test data
    test_json_file_path = os.path.join("data/kaggle", "arc-agi_test_challenges.json")
    test_data_by_name_d = load_json_data(test_json_file_path)

    # Load training data and update main data
    train_json_file_path = os.path.join(
        "data/kaggle", "arc-agi_training_challenges.json"
    )
    train_data_by_name_d = load_json_data(train_json_file_path)

    # Load evaluation data
    eval_json_file_path = os.path.join(
        "data/kaggle", "arc-agi_evaluation_challenges.json"
    )
    eval_data_by_name_d = load_json_data(eval_json_file_path)

    if verbose:
        print(f"len(train_data_by_name_d)={len(train_data_by_name_d)}")
        print(f"len(eval_data_by_name_d)={len(eval_data_by_name_d)}")
        print(f"len(test_data_by_name_d)={len(test_data_by_name_d)}")

    return train_data_by_name_d, eval_data_by_name_d, test_data_by_name_d


if __name__ == "__main__":
    load_train_eval_test_data(verbose=True)
