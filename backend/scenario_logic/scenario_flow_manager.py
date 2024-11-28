# xploitcraft/backend/scenario_logic/scenario_flow_manager.py

# xploitcraft/backend/scenario_logic/scenario_flow_manager.py

class ScenarioFlowManager:
    """
    Manages user progression through a scenario.
    """

    def __init__(self, scenario_breakdown):
        self.scenario_breakdown = scenario_breakdown
        self.steps = ['context', 'actors', 'risks', 'mitigation_steps']
        self.current_step = 0
        self.step_stack = []  # Track previously visited steps

    def get_next_step(self):
        """
        Provides the next step in the flow.
        """
        if self.current_step < len(self.steps):
            next_step = self.steps[self.current_step]
            self.step_stack.append(self.current_step)  # Save current step before moving
            self.current_step += 1
            return {next_step: self.scenario_breakdown[next_step]}
        return None

    def get_previous_step(self):
        """
        Provides the previous step in the flow.
        """
        if self.step_stack:
            self.current_step = self.step_stack.pop()  # Go back to the previous step
            step_key = self.steps[self.current_step]
            return {step_key: self.scenario_breakdown[step_key]}
        return None

    def save_user_choice(self, choice):
        """
        Saves the user choice for later analysis.
        """
        # Placeholder for saving user choice
        pass

