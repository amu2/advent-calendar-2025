#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Split advent_data.json into individual day files.
"""
import json
import os

def split_advent_json():
    # Read the big JSON file
    with open('public/advent_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Create metadata.json (without days)
    metadata = {
        "metadata": data["metadata"],
        "colorScheme": data["colorScheme"]
    }
    
    with open('public/data/metadata.json', 'w', encoding='utf-8') as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Created public/data/metadata.json")
    
    # Create individual day files
    for day_data in data["days"]:
        day_num = day_data["day"]
        filename = f"public/data/days/day{day_num:02d}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(day_data, f, ensure_ascii=False, indent=2)
        
        print(f"✓ Created {filename}")
    
    print(f"\n✅ Split complete! Created {len(data['days'])} day files.")

if __name__ == '__main__':
    split_advent_json()
