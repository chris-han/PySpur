import hashlib
import itertools
import json

import numpy as np


def permutation_list(n: int):
    assert n > 1
    gen = np.random.default_rng(n)
    if n <= 7:
        out = list(itertools.permutations(range(n)))
        out.remove(tuple(range(n)))
        gen.shuffle(out)
        return out

    out = [
        tuple(int(y) for y in x)
        for x in np.array([gen.permutation(n) for _ in range(3000)]).tolist()
    ]
    try:
        out.remove(tuple(range(n)))
    except ValueError:
        ...
    return out


ALL_PERMUTATION_INDICES = {n: permutation_list(n) for n in range(2, 11)}

hasher = hashlib.md5()
hasher.update(json.dumps(ALL_PERMUTATION_INDICES).encode())
assert hasher.hexdigest() == "bfe41d1bebc5f8bbb40f7ae40b446e8f"
