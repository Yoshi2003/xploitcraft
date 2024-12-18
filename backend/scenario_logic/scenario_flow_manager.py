class ScenarioFlowManager:
    """
    Manages user progression through a scenario.
    """

    def __init__(self, scenario_breakdown):
        self.scenario_breakdown = scenario_breakdown
        self.steps = ['context', 'actors', 'risks', 'mitigation_steps']
        self.current_step = 0
        self.step_stack = []  

    def get_next_step(self):
        """
        Provides the next step in the flow.
        """
        if self.current_step < len(self.steps):
            next_step = self.steps[self.current_step]
            self.step_stack.append(self.current_step)  
            self.current_step += 1
            return {next_step: self.scenario_breakdown[next_step]}
        return None

    def get_previous_step(self):
        """
        Provides the previous step in the flow.
        """
        if self.step_stack:
            self.current_step = self.step_stack.pop()  
            step_key = self.steps[self.current_step]
            return {step_key: self.scenario_breakdown[step_key]}
        return None

    def save_user_choice(self, choice):
        """
        Saves the user choice for later analysis.
        """
       
        pass

